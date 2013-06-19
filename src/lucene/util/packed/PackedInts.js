var util = require('util');
var assert = require('assert');
var defineClass = require('library/class/defineClass.js');
var Class = require('library/class/Class.js');
var CodecUtil = require('library/lucene/codecs/CodecUtil.js');

var IllegalArgumentException = require('library/lucene/util/IllegalArgumentException.js');
var AssertionError = require('library/java/lang/AssertionError.js');


/**
 * Simplistic compression for array of unsigned long values.
 * Each value is >= 0 and <= a specified maximum value.  The
 * values are stored as packed ints, with each value
 * consuming a fixed number of bits.
 *
 * @lucene.internal
 */
var PackedInts = defineClass({
	name : "PackedInts",
	statics : {

		  /**
		   * At most 700% memory overhead, always select a direct implementation.
		   */
		   FASTEST : 7.0, 
		
		  /**
		   * At most 50% memory overhead, always select a reasonably fast implementation.
		   */
		   FAST : 0.5, 
		
		  /**
		   * At most 20% memory overhead.
		   */
		   DEFAULT : 0.2, 
		
		  /**
		   * No memory overhead at all, but the returned implementation may be slow.
		   */
		   COMPACT : 0.0, 
		
		  /**
		   * Default amount of memory to use for bulk operations.
		   */
		   DEFAULT_BUFFER_SIZE : 1024, // 1K
		
		   CODEC_NAME : "PackedInts", 
		   VERSION_START : 0, // PackedInts were long-aligned
		   VERSION_BYTE_ALIGNED : 1, 
		   VERSION_CURRENT : 1, 
		  

		  /**
		   * Check the validity of a version number.
		   */
		   checkVersion : function(/* int */ version) {
		    if (version < PackedInts.VERSION_START) {
		      throw new IllegalArgumentException("Version is too old, should be at least " + PackedInts.VERSION_START + " (got " + version + ")");
		    } else if (version > PackedInts.VERSION_CURRENT) {
		      throw new IllegalArgumentException("Version is too new, should be at most " + PackedInts.VERSION_CURRENT + " (got " + version + ")");
		    }
		  }, 


		  /**
		   * Try to find the {@link Format} and number of bits per value that would
		   * restore from disk the fastest reader whose overhead is less than
		   * <code>acceptableOverheadRatio</code>.
		   * </p><p>
		   * The <code>acceptableOverheadRatio</code> parameter makes sense for
		   * random-access {@link Reader}s. In case you only plan to perform
		   * sequential access on this stream later on, you should probably use
		   * {@link PackedInts#COMPACT}.
		   * </p><p>
		   * If you don't know how many values you are going to write, use
		   * <code>valueCount = -1</code>.
		   */
		   //@return FormatAndBits
		   fastestFormatAndBits : function(/* int */ valueCount, /* int */ bitsPerValue, /* float */ acceptableOverheadRatio) {
			    if (valueCount == -1) {
			      valueCount = Number.MAX_VALUE;
			    }
			
			    acceptableOverheadRatio = Math.max(PackedInts.COMPACT, acceptableOverheadRatio);
			    acceptableOverheadRatio = Math.min(PackedInts.FASTEST, acceptableOverheadRatio);
			    var acceptableOverheadPerValue = acceptableOverheadRatio * bitsPerValue; // in bits  //float
			
			    var maxBitsPerValue = bitsPerValue + Math.floor(acceptableOverheadPerValue);
			
			    var actualBitsPerValue = -1;
			    var format = Format.PACKED; //Format
			
			    if (bitsPerValue <= 8 && maxBitsPerValue >= 8) {
			      actualBitsPerValue = 8;
			    } else if (bitsPerValue <= 16 && maxBitsPerValue >= 16) {
			      actualBitsPerValue = 16;
			    } else if (bitsPerValue <= 32 && maxBitsPerValue >= 32) {
			      actualBitsPerValue = 32;
			    } else if (bitsPerValue <= 64 && maxBitsPerValue >= 64) {
			      actualBitsPerValue = 64;
			    } else if (valueCount <= Packed8ThreeBlocks.MAX_SIZE && bitsPerValue <= 24 && maxBitsPerValue >= 24) {
			      actualBitsPerValue = 24;
			    } else if (valueCount <= Packed16ThreeBlocks.MAX_SIZE && bitsPerValue <= 48 && maxBitsPerValue >= 48) {
			      actualBitsPerValue = 48;
			    } else {
			      for (var bpv = bitsPerValue; bpv <= maxBitsPerValue; ++bpv) {
			        if (Format.PACKED_SINGLE_BLOCK.isSupported(bpv)) {
			          var overhead = Format.PACKED_SINGLE_BLOCK.overheadPerValue(bpv);
			          var acceptableOverhead = acceptableOverheadPerValue + bitsPerValue - bpv;
			          if (overhead <= acceptableOverhead) {
			            actualBitsPerValue = bpv;
			            format = Format.PACKED_SINGLE_BLOCK;
			            break;
			          }
			        }
			      }
			      if (actualBitsPerValue < 0) {
			        actualBitsPerValue = bitsPerValue;
			      }
			    }
			
			    return new FormatAndBits(format, actualBitsPerValue);
		  }, 
  

		  /**
		   * Get a {@link Decoder}.
		   *
		   * @param format         the format used to store packed ints
		   * @param version        the compatibility version
		   * @param bitsPerValue   the number of bits per value
		   * @return a decoder
		   */
		  //@return Decoder
		   getDecoder : function(/* Format */ format, /* int */ version, /* int */ bitsPerValue) {
		    PackedInts.checkVersion(version);
		    var BulkOperation = require('./BulkOperation.js');
		    return BulkOperation.of(format, bitsPerValue);
		  },
		
		  /**
		   * Get an {@link Encoder}.
		   *
		   * @param format         the format used to store packed ints
		   * @param version        the compatibility version
		   * @param bitsPerValue   the number of bits per value
		   * @return an encoder
		   */
		   //@return Encoder
		   getEncoder : function(/* Format */ format, /* int */ version, /* int */ bitsPerValue) {
		    PackedInts.checkVersion(version);
		    var BulkOperation = require('./BulkOperation.js');
		    return BulkOperation.of(format, bitsPerValue);
		  },
		
		  /**
		   * Expert: Restore a {@link Reader} from a stream without reading metadata at
		   * the beginning of the stream. This method is useful to restore data from
		   * streams which have been created using
		   * {@link PackedInts#getWriterNoHeader(DataOutput, Format, int, int, int)}.
		   *
		   * @param in           the stream to read data from, positioned at the beginning of the packed values
		   * @param format       the format used to serialize
		   * @param version      the version used to serialize the data
		   * @param valueCount   how many values the stream holds
		   * @param bitsPerValue the number of bits per value
		   * @return             a Reader
		   * @throws IOException If there is a low-level I/O error
		   * @see PackedInts#getWriterNoHeader(DataOutput, Format, int, int, int)
		   * @lucene.internal
		   */
		   //@return Reader
		   getReaderNoHeader : function(/* DataInput */ _in, /* Format */ format, /* int */ version, /* int */ valueCount, /* int */ bitsPerValue)  {
		      
		      var Packed8ThreeBlocks = require('./Packed8ThreeBlocks.js');
		      var Packed16ThreeBlocks = require('./Packed16ThreeBlocks.js');
		      var Packed64SingleBlock = require('./Packed64SingleBlock.js');
		      var Direct8 = require('./Direct8.js');
		      var Direct16 = require('./Direct16.js');
		      var Direct32 = require('./Direct32.js');
		      var Direct64 = require('./Direct64.js');
		      var Packed64 = require('./Packed64.js');

		     PackedInts.checkVersion(version);
		     
		     //TODO - check this switch-case comparison as the value is an object here....
		     if(format === PackedInts.PACKED_SINGLE_BLOCK)
		     	return Packed64SingleBlock.create(_in, valueCount, bitsPerValue);
		     	
		     else if(format === PackedInts.PACKED){
		     
		        switch (bitsPerValue) {
		          case 8:
		            return new Direct8(version, _in, valueCount);
		          case 16:
		            return new Direct16(version, _in, valueCount);
		          case 32:
		            return new Direct32(version, _in, valueCount);
		          case 64:
		            return new Direct64(version, _in, valueCount);
		          case 24:
		            if (valueCount <= Packed8ThreeBlocks.MAX_SIZE) {
		              return new Packed8ThreeBlocks(version, _in, valueCount);
		            }
		            break;
		          case 48:
		            if (valueCount <= Packed16ThreeBlocks.MAX_SIZE) {
		              return new Packed16ThreeBlocks(version, _in, valueCount);
		            }
		            break;
		        }
		        return new Packed64(version, _in, valueCount, bitsPerValue);		     
		     }
		     else throw new AssertionError("Unknown Writer format: " + format);
		  }, 
		  
		  /**
		   * Expert: Restore a {@link Reader} from a stream without reading metadata at
		   * the beginning of the stream. This method is useful to restore data when
		   * metadata has been previously read using {@link #readHeader(DataInput)}.
		   *
		   * @param in           the stream to read data from, positioned at the beginning of the packed values
		   * @param header       metadata result from <code>readHeader()</code>
		   * @return             a Reader
		   * @throws IOException If there is a low-level I/O error
		   * @see #readHeader(DataInput)
		   * @lucene.internal
		   */
		  public static Reader getReaderNoHeader(DataInput in, Header header) throws IOException {
		    return getReaderNoHeader(in, header.format, header.version, header.valueCount, header.bitsPerValue);
		  }
		
		  /**
		   * Restore a {@link Reader} from a stream.
		   *
		   * @param in           the stream to read data from
		   * @return             a Reader
		   * @throws IOException If there is a low-level I/O error
		   * @lucene.internal
		   */
		  public static Reader getReader(DataInput in) throws IOException {
		    final int version = CodecUtil.checkHeader(in, CODEC_NAME, VERSION_START, VERSION_CURRENT);
		    final int bitsPerValue = in.readVInt();
		    assert bitsPerValue > 0 && bitsPerValue <= 64: "bitsPerValue=" + bitsPerValue;
		    final int valueCount = in.readVInt();
		    final Format format = Format.byId(in.readVInt());
		
		    return getReaderNoHeader(in, format, version, valueCount, bitsPerValue);
		  }
		
		  /**
		   * Expert: Restore a {@link ReaderIterator} from a stream without reading
		   * metadata at the beginning of the stream. This method is useful to restore
		   * data from streams which have been created using
		   * {@link PackedInts#getWriterNoHeader(DataOutput, Format, int, int, int)}.
		   *
		   * @param in           the stream to read data from, positioned at the beginning of the packed values
		   * @param format       the format used to serialize
		   * @param version      the version used to serialize the data
		   * @param valueCount   how many values the stream holds
		   * @param bitsPerValue the number of bits per value
		   * @param mem          how much memory the iterator is allowed to use to read-ahead (likely to speed up iteration)
		   * @return             a ReaderIterator
		   * @see PackedInts#getWriterNoHeader(DataOutput, Format, int, int, int)
		   * @lucene.internal
		   */
		  public static ReaderIterator getReaderIteratorNoHeader(DataInput in, Format format, int version,
		      int valueCount, int bitsPerValue, int mem) {
		    checkVersion(version);
		    return new PackedReaderIterator(format, version, valueCount, bitsPerValue, in, mem);
		  }
		
		  /**
		   * Retrieve PackedInts as a {@link ReaderIterator}
		   * @param in positioned at the beginning of a stored packed int structure.
		   * @param mem how much memory the iterator is allowed to use to read-ahead (likely to speed up iteration)
		   * @return an iterator to access the values
		   * @throws IOException if the structure could not be retrieved.
		   * @lucene.internal
		   */
		  public static ReaderIterator getReaderIterator(DataInput in, int mem) throws IOException {
		    final int version = CodecUtil.checkHeader(in, CODEC_NAME, VERSION_START, VERSION_CURRENT);
		    final int bitsPerValue = in.readVInt();
		    assert bitsPerValue > 0 && bitsPerValue <= 64: "bitsPerValue=" + bitsPerValue;
		    final int valueCount = in.readVInt();
		    final Format format = Format.byId(in.readVInt());
		    return getReaderIteratorNoHeader(in, format, version, valueCount, bitsPerValue, mem);
		  }
		
		  /**
		   * Expert: Construct a direct {@link Reader} from a stream without reading
		   * metadata at the beginning of the stream. This method is useful to restore
		   * data from streams which have been created using
		   * {@link PackedInts#getWriterNoHeader(DataOutput, Format, int, int, int)}.
		   * </p><p>
		   * The returned reader will have very little memory overhead, but every call
		   * to {@link Reader#get(int)} is likely to perform a disk seek.
		   *
		   * @param in           the stream to read data from
		   * @param format       the format used to serialize
		   * @param version      the version used to serialize the data
		   * @param valueCount   how many values the stream holds
		   * @param bitsPerValue the number of bits per value
		   * @return a direct Reader
		   * @lucene.internal
		   */
		  public static Reader getDirectReaderNoHeader(final IndexInput in, Format format,
		      int version, int valueCount, int bitsPerValue) {
		    checkVersion(version);
		    switch (format) {
		      case PACKED:
		        final long byteCount = format.byteCount(version, valueCount, bitsPerValue);
		        if (byteCount != format.byteCount(VERSION_CURRENT, valueCount, bitsPerValue)) {
		          assert version == VERSION_START;
		          final long endPointer = in.getFilePointer() + byteCount;
		          // Some consumers of direct readers assume that reading the last value
		          // will make the underlying IndexInput go to the end of the packed
		          // stream, but this is not true because packed ints storage used to be
		          // long-aligned and is now byte-aligned, hence this additional
		          // condition when reading the last value
		          return new DirectPackedReader(bitsPerValue, valueCount, in) {
		            @Override
		            public long get(int index) {
		              final long result = super.get(index);
		              if (index == valueCount - 1) {
		                try {
		                  in.seek(endPointer);
		                } catch (IOException e) {
		                  throw new IllegalStateException("failed", e);
		                }
		              }
		              return result;
		            }
		          };
		        } else {
		          return new DirectPackedReader(bitsPerValue, valueCount, in);
		        }
		      case PACKED_SINGLE_BLOCK:
		        return new DirectPacked64SingleBlockReader(bitsPerValue, valueCount, in);
		      default:
		        throw new AssertionError("Unknwown format: " + format);
		    }
		  }
		  
		  /**
		   * Expert: Construct a direct {@link Reader} from an {@link IndexInput} 
		   * without reading metadata at the beginning of the stream. This method is 
		   * useful to restore data when metadata has been previously read using 
		   * {@link #readHeader(DataInput)}.
		   *
		   * @param in           the stream to read data from, positioned at the beginning of the packed values
		   * @param header       metadata result from <code>readHeader()</code>
		   * @return             a Reader
		   * @throws IOException If there is a low-level I/O error
		   * @see #readHeader(DataInput)
		   * @lucene.internal
		   */
		  public static Reader getDirectReaderNoHeader(IndexInput in, Header header) throws IOException {
		    return getDirectReaderNoHeader(in, header.format, header.version, header.valueCount, header.bitsPerValue);
		  }
		
		  /**
		   * Construct a direct {@link Reader} from an {@link IndexInput}. This method
		   * is useful to restore data from streams which have been created using
		   * {@link PackedInts#getWriter(DataOutput, int, int, float)}.
		   * </p><p>
		   * The returned reader will have very little memory overhead, but every call
		   * to {@link Reader#get(int)} is likely to perform a disk seek.
		   *
		   * @param in           the stream to read data from
		   * @return a direct Reader
		   * @throws IOException If there is a low-level I/O error
		   * @lucene.internal
		   */
		  public static Reader getDirectReader(IndexInput in) throws IOException {
		    final int version = CodecUtil.checkHeader(in, CODEC_NAME, VERSION_START, VERSION_CURRENT);
		    final int bitsPerValue = in.readVInt();
		    assert bitsPerValue > 0 && bitsPerValue <= 64: "bitsPerValue=" + bitsPerValue;
		    final int valueCount = in.readVInt();
		    final Format format = Format.byId(in.readVInt());
		    return getDirectReaderNoHeader(in, format, version, valueCount, bitsPerValue);
		  }
		  
		  /**
		   * Create a packed integer array with the given amount of values initialized
		   * to 0. the valueCount and the bitsPerValue cannot be changed after creation.
		   * All Mutables known by this factory are kept fully in RAM.
		   * </p><p>
		   * Positive values of <code>acceptableOverheadRatio</code> will trade space
		   * for speed by selecting a faster but potentially less memory-efficient
		   * implementation. An <code>acceptableOverheadRatio</code> of
		   * {@link PackedInts#COMPACT} will make sure that the most memory-efficient
		   * implementation is selected whereas {@link PackedInts#FASTEST} will make sure
		   * that the fastest implementation is selected.
		   *
		   * @param valueCount   the number of elements
		   * @param bitsPerValue the number of bits available for any given value
		   * @param acceptableOverheadRatio an acceptable overhead
		   *        ratio per value
		   * @return a mutable packed integer array
		   * @lucene.internal
		   */
		  public static Mutable getMutable(int valueCount,
		      int bitsPerValue, float acceptableOverheadRatio) {
		
			      var Packed64SingleBlock = require('./Packed64SingleBlock.js');

		    assert valueCount >= 0;
		
		    final FormatAndBits formatAndBits = fastestFormatAndBits(valueCount, bitsPerValue, acceptableOverheadRatio);
		    switch (formatAndBits.format) {
		      case PACKED_SINGLE_BLOCK:
		        return Packed64SingleBlock.create(valueCount, formatAndBits.bitsPerValue);
		      case PACKED:
		        switch (formatAndBits.bitsPerValue) {
		          case 8:
		            return new Direct8(valueCount);
		          case 16:
		            return new Direct16(valueCount);
		          case 32:
		            return new Direct32(valueCount);
		          case 64:
		            return new Direct64(valueCount);
		          case 24:
		            if (valueCount <= Packed8ThreeBlocks.MAX_SIZE) {
		              return new Packed8ThreeBlocks(valueCount);
		            }
		            break;
		          case 48:
		            if (valueCount <= Packed16ThreeBlocks.MAX_SIZE) {
		              return new Packed16ThreeBlocks(valueCount);
		            }
		            break;
		        }
		        return new Packed64(valueCount, formatAndBits.bitsPerValue);
		      default:
		        throw new AssertionError();
		    }
		  }
		
		  /**
		   * Expert: Create a packed integer array writer for the given output, format,
		   * value count, and number of bits per value.
		   * </p><p>
		   * The resulting stream will be long-aligned. This means that depending on
		   * the format which is used, up to 63 bits will be wasted. An easy way to
		   * make sure that no space is lost is to always use a <code>valueCount</code>
		   * that is a multiple of 64.
		   * </p><p>
		   * This method does not write any metadata to the stream, meaning that it is
		   * your responsibility to store it somewhere else in order to be able to
		   * recover data from the stream later on:
		   * <ul>
		   *   <li><code>format</code> (using {@link Format#getId()}),</li>
		   *   <li><code>valueCount</code>,</li>
		   *   <li><code>bitsPerValue</code>,</li>
		   *   <li>{@link #VERSION_CURRENT}.</li>
		   * </ul>
		   * </p><p>
		   * It is possible to start writing values without knowing how many of them you
		   * are actually going to write. To do this, just pass <code>-1</code> as
		   * <code>valueCount</code>. On the other hand, for any positive value of
		   * <code>valueCount</code>, the returned writer will make sure that you don't
		   * write more values than expected and pad the end of stream with zeros in
		   * case you have written less than <code>valueCount</code> when calling
		   * {@link Writer#finish()}.
		   * </p><p>
		   * The <code>mem</code> parameter lets you control how much memory can be used
		   * to buffer changes in memory before flushing to disk. High values of
		   * <code>mem</code> are likely to improve throughput. On the other hand, if
		   * speed is not that important to you, a value of <code>0</code> will use as
		   * little memory as possible and should already offer reasonable throughput.
		   *
		   * @param out          the data output
		   * @param format       the format to use to serialize the values
		   * @param valueCount   the number of values
		   * @param bitsPerValue the number of bits per value
		   * @param mem          how much memory (in bytes) can be used to speed up serialization
		   * @return             a Writer
		   * @see PackedInts#getReaderIteratorNoHeader(DataInput, Format, int, int, int, int)
		   * @see PackedInts#getReaderNoHeader(DataInput, Format, int, int, int)
		   * @lucene.internal
		   */
		  public static Writer getWriterNoHeader(
		      DataOutput out, Format format, int valueCount, int bitsPerValue, int mem) {
		    return new PackedWriter(format, out, valueCount, bitsPerValue, mem);
		  }
		
		  /**
		   * Create a packed integer array writer for the given output, format, value
		   * count, and number of bits per value.
		   * </p><p>
		   * The resulting stream will be long-aligned. This means that depending on
		   * the format which is used under the hoods, up to 63 bits will be wasted.
		   * An easy way to make sure that no space is lost is to always use a
		   * <code>valueCount</code> that is a multiple of 64.
		   * </p><p>
		   * This method writes metadata to the stream, so that the resulting stream is
		   * sufficient to restore a {@link Reader} from it. You don't need to track
		   * <code>valueCount</code> or <code>bitsPerValue</code> by yourself. In case
		   * this is a problem, you should probably look at
		   * {@link #getWriterNoHeader(DataOutput, Format, int, int, int)}.
		   * </p><p>
		   * The <code>acceptableOverheadRatio</code> parameter controls how
		   * readers that will be restored from this stream trade space
		   * for speed by selecting a faster but potentially less memory-efficient
		   * implementation. An <code>acceptableOverheadRatio</code> of
		   * {@link PackedInts#COMPACT} will make sure that the most memory-efficient
		   * implementation is selected whereas {@link PackedInts#FASTEST} will make sure
		   * that the fastest implementation is selected. In case you are only interested
		   * in reading this stream sequentially later on, you should probably use
		   * {@link PackedInts#COMPACT}.
		   *
		   * @param out          the data output
		   * @param valueCount   the number of values
		   * @param bitsPerValue the number of bits per value
		   * @param acceptableOverheadRatio an acceptable overhead ratio per value
		   * @return             a Writer
		   * @throws IOException If there is a low-level I/O error
		   * @lucene.internal
		   */
		  public static Writer getWriter(DataOutput out,
		      int valueCount, int bitsPerValue, float acceptableOverheadRatio)
		    throws IOException {
		    assert valueCount >= 0;
		
		    final FormatAndBits formatAndBits = fastestFormatAndBits(valueCount, bitsPerValue, acceptableOverheadRatio);
		    final Writer writer = getWriterNoHeader(out, formatAndBits.format, valueCount, formatAndBits.bitsPerValue, DEFAULT_BUFFER_SIZE);
		    writer.writeHeader();
		    return writer;
		  }
		
		  /** Returns how many bits are required to hold values up
		   *  to and including maxValue
		   * @param maxValue the maximum value that should be representable.
		   * @return the amount of bits needed to represent values from 0 to maxValue.
		   * @lucene.internal
		   */
		  public static int bitsRequired(long maxValue) {
		    if (maxValue < 0) {
		      throw new IllegalArgumentException("maxValue must be non-negative (got: " + maxValue + ")");
		    }
		    return Math.max(1, 64 - Long.numberOfLeadingZeros(maxValue));
		  }
		
		  /**
		   * Calculates the maximum unsigned long that can be expressed with the given
		   * number of bits.
		   * @param bitsPerValue the number of bits available for any given value.
		   * @return the maximum value for the given bits.
		   * @lucene.internal
		   */
		  public static long maxValue(int bitsPerValue) {
		    return bitsPerValue == 64 ? Long.MAX_VALUE : ~(~0L << bitsPerValue);
		  }
		
		  /**
		   * Copy <code>src[srcPos:srcPos+len]</code> into
		   * <code>dest[destPos:destPos+len]</code> using at most <code>mem</code>
		   * bytes.
		   */
		  public static void copy(Reader src, int srcPos, Mutable dest, int destPos, int len, int mem) {
		    assert srcPos + len <= src.size();
		    assert destPos + len <= dest.size();
		    final int capacity = mem >>> 3;
		    if (capacity == 0) {
		      for (int i = 0; i < len; ++i) {
		        dest.set(destPos++, src.get(srcPos++));
		      }
		    } else {
		      // use bulk operations
		      long[] buf = new long[Math.min(capacity, len)];
		      int remaining = 0;
		      while (len > 0) {
		        final int read = src.get(srcPos, buf, remaining, Math.min(len, buf.length - remaining));
		        assert read > 0;
		        srcPos += read;
		        len -= read;
		        remaining += read;
		        final int written = dest.set(destPos, buf, 0, remaining);
		        assert written > 0;
		        destPos += written;
		        if (written < remaining) {
		          System.arraycopy(buf, written, buf, 0, remaining - written);
		        }
		        remaining -= written;
		      }
		      while (remaining > 0) {
		        final int written = dest.set(destPos, buf, 0, remaining);
		        destPos += written;
		        remaining -= written;
		        System.arraycopy(buf, written, buf, 0, remaining);
		      }
		    }
		  }
		  
		  /**
		   * Expert: reads only the metadata from a stream. This is useful to later
		   * restore a stream or open a direct reader via 
		   * {@link #getReaderNoHeader(DataInput, Header)}
		   * or {@link #getDirectReaderNoHeader(IndexInput, Header)}.
		   * @param    in the stream to read data
		   * @return   packed integer metadata.
		   * @throws   IOException If there is a low-level I/O error
		   * @see #getReaderNoHeader(DataInput, Header)
		   * @see #getDirectReaderNoHeader(IndexInput, Header)
		   */
		  public static Header readHeader(DataInput in) throws IOException {
		    final int version = CodecUtil.checkHeader(in, CODEC_NAME, VERSION_START, VERSION_CURRENT);
		    final int bitsPerValue = in.readVInt();
		    assert bitsPerValue > 0 && bitsPerValue <= 64: "bitsPerValue=" + bitsPerValue;
		    final int valueCount = in.readVInt();
		    final Format format = Format.byId(in.readVInt());
		    return new Header(format, valueCount, bitsPerValue, version);
		  }

      
	}, 
	
	construct : function(){
		
	},
	
	
});


/**
 * A format to write packed ints.
 *
 * @lucene.internal
 */
var Format = defineClass({
	name: "Format",
	statics: {
		//returns an array of all defined static values
		values: function() {
			var vals = [];
			for (var p in Format) {
				if (Format.hasOwnProperty(p) && Class.isInstanceOfClass(Format[p], "Format")) vals.push(Format[p]);
			}
			return vals;
		},
		/**
		 * Get a format according to its ID.
		 */
		//@return Format
		byId: function( /* int */ id) {
			for ( /* Format */
			var format in Format.values()) {
				if (format.getId() == id) {
					return format;
				}
			}
			throw new IllegalArgumentException("Unknown format id: " + id);
		}
	},
	variables: {
		id: null //int identifier	
	},
	construct: function(id) {
		this.id = id;
	},
	methods: {
		/**
		 * Computes how many byte blocks are needed to store <code>values</code>
		 * values of size <code>bitsPerValue</code>.
		 */
		//@return long
		byteCount: function( /* int */ packedIntsVersion, /* int */ valueCount, /* int */ bitsPerValue) {
			assert(bitsPerValue >= 0 && bitsPerValue <= 64, "bitsPerValue=" + bitsPerValue);
			// assume long-aligned
			return 8 * this.longCount(packedIntsVersion, valueCount, bitsPerValue);
		},
		/**
		 * Computes how many long blocks are needed to store <code>values</code>
		 * values of size <code>bitsPerValue</code>.
		 */
		//@return int 
		longCount: function( /* int */ packedIntsVersion, /* int */ valueCount, /* int */ bitsPerValue) {
			assert(bitsPerValue >= 0 && bitsPerValue <= 64, "bitsPerValue=" + bitsPerValue);
			var byteCount = this.byteCount(packedIntsVersion, valueCount, bitsPerValue); //long
			assert(byteCount < 8 * Number.MAX_VALUE);
			return Math.ceil(byteCount / 8);
/*
		      if ((byteCount % 8) == 0) {
		        return (byteCount / 8);
		      } else {
		        return (byteCount / 8 + 1);
		      }
*/
		},
		/**
		 * Tests whether the provided number of bits per value is supported by the
		 * format.
		 */
		isSupported: function( /* int */ bitsPerValue) {
			return bitsPerValue >= 1 && bitsPerValue <= 64;
		},
		/**
		 * Returns the overhead per value, in bits.
		 */
		overheadPerValue: function( /* int */ bitsPerValue) {
			assert(this.isSupported(bitsPerValue));
			return 0;
		},
		/**
		 * Returns the overhead ratio (<code>overhead per value / bits per value</code>).
		 */
		//@return float
		overheadRatio: function( /* int */ bitsPerValue) {
			assert(this.isSupported(bitsPerValue));
			return this.overheadPerValue(bitsPerValue) / bitsPerValue;
		},
		/**
		 * Returns the ID of the format.
		 */
		getId: function() {
			return this.id;
		}
	}
});
/**
 * Compact format, all bits are written contiguously.
 */
Format.PACKED = new Format(0);
Format.PACKED.byteCount = function( /* int */ packedIntsVersion, /* int */ valueCount, /* int */ bitsPerValue) {
	if (packedIntsVersion < PackedInts.VERSION_BYTE_ALIGNED) {
		return 8 * Math.ceil(valueCount * bitsPerValue / 64);
	} else {
		return Math.ceil(valueCount * bitsPerValue / 8);
	}
};
/**
 * A format that may insert padding bits to improve encoding and decoding
 * speed. Since this format doesn't support all possible bits per value, you
 * should never use it directly, but rather use
 * {@link PackedInts#fastestFormatAndBits(int, int, float)} to find the
 * format that best suits your needs.
 */
Format.PACKED_SINGLE_BLOCK = new Format(1);
Format.PACKED_SINGLE_BLOCK.longCount = function(/* int */ packedIntsVersion, /* int */ valueCount, /* int */ bitsPerValue) {
	var valuesPerBlock = 64 / bitsPerValue;
	return Math.ceil( valueCount / valuesPerBlock);
};
Format.PACKED_SINGLE_BLOCK.isSupported = function(/* int */ bitsPerValue) {
    var Packed64SingleBlock = require('./Packed64SingleBlock.js');
	return Packed64SingleBlock.isSupported(bitsPerValue);
};
Format.PACKED_SINGLE_BLOCK.overheadPerValue = function(/* int */ bitsPerValue) {
	assert(this.isSupported(bitsPerValue));
	var valuesPerBlock = 64 / bitsPerValue; //int
	var overhead = 64 % bitsPerValue; //int
	return overhead / valuesPerBlock; //float
};

/**
* Simple class that holds a format and a number of bits per value.
*/
public static class FormatAndBits {
    public final Format format;
    public final int bitsPerValue;
    public FormatAndBits(Format format, int bitsPerValue) {
      this.format = format;
      this.bitsPerValue = bitsPerValue;
    }
  }


/**
* A decoder for packed integers.
*/
public static interface Decoder {

    /**
     * The minimum number of long blocks to encode in a single iteration, when
     * using long encoding.
     */
    int longBlockCount();

    /**
     * The number of values that can be stored in {@link #longBlockCount()} long
     * blocks.
     */
    int longValueCount();

    /**
     * The minimum number of byte blocks to encode in a single iteration, when
     * using byte encoding.
     */
    int byteBlockCount();

    /**
     * The number of values that can be stored in {@link #byteBlockCount()} byte
     * blocks.
     */
    int byteValueCount();

    /**
     * Read <code>iterations * blockCount()</code> blocks from <code>blocks</code>,
     * decode them and write <code>iterations * valueCount()</code> values into
     * <code>values</code>.
     *
     * @param blocks       the long blocks that hold packed integer values
     * @param blocksOffset the offset where to start reading blocks
     * @param values       the values buffer
     * @param valuesOffset the offset where to start writing values
     * @param iterations   controls how much data to decode
     */
    void decode(long[] blocks, int blocksOffset, long[] values, int valuesOffset, int iterations);

    /**
     * Read <code>8 * iterations * blockCount()</code> blocks from <code>blocks</code>,
     * decode them and write <code>iterations * valueCount()</code> values into
     * <code>values</code>.
     *
     * @param blocks       the long blocks that hold packed integer values
     * @param blocksOffset the offset where to start reading blocks
     * @param values       the values buffer
     * @param valuesOffset the offset where to start writing values
     * @param iterations   controls how much data to decode
     */
    void decode(byte[] blocks, int blocksOffset, long[] values, int valuesOffset, int iterations);

    /**
     * Read <code>iterations * blockCount()</code> blocks from <code>blocks</code>,
     * decode them and write <code>iterations * valueCount()</code> values into
     * <code>values</code>.
     *
     * @param blocks       the long blocks that hold packed integer values
     * @param blocksOffset the offset where to start reading blocks
     * @param values       the values buffer
     * @param valuesOffset the offset where to start writing values
     * @param iterations   controls how much data to decode
     */
    void decode(long[] blocks, int blocksOffset, int[] values, int valuesOffset, int iterations);

    /**
     * Read <code>8 * iterations * blockCount()</code> blocks from <code>blocks</code>,
     * decode them and write <code>iterations * valueCount()</code> values into
     * <code>values</code>.
     *
     * @param blocks       the long blocks that hold packed integer values
     * @param blocksOffset the offset where to start reading blocks
     * @param values       the values buffer
     * @param valuesOffset the offset where to start writing values
     * @param iterations   controls how much data to decode
     */
    void decode(byte[] blocks, int blocksOffset, int[] values, int valuesOffset, int iterations);

  }

/**
* An encoder for packed integers.
*/
public static interface Encoder {

    /**
     * The minimum number of long blocks to encode in a single iteration, when
     * using long encoding.
     */
    int longBlockCount();

    /**
     * The number of values that can be stored in {@link #longBlockCount()} long
     * blocks.
     */
    int longValueCount();

    /**
     * The minimum number of byte blocks to encode in a single iteration, when
     * using byte encoding.
     */
    int byteBlockCount();

    /**
     * The number of values that can be stored in {@link #byteBlockCount()} byte
     * blocks.
     */
    int byteValueCount();

    /**
     * Read <code>iterations * valueCount()</code> values from <code>values</code>,
     * encode them and write <code>iterations * blockCount()</code> blocks into
     * <code>blocks</code>.
     *
     * @param blocks       the long blocks that hold packed integer values
     * @param blocksOffset the offset where to start writing blocks
     * @param values       the values buffer
     * @param valuesOffset the offset where to start reading values
     * @param iterations   controls how much data to encode
     */
    void encode(long[] values, int valuesOffset, long[] blocks, int blocksOffset, int iterations);

    /**
     * Read <code>iterations * valueCount()</code> values from <code>values</code>,
     * encode them and write <code>8 * iterations * blockCount()</code> blocks into
     * <code>blocks</code>.
     *
     * @param blocks       the long blocks that hold packed integer values
     * @param blocksOffset the offset where to start writing blocks
     * @param values       the values buffer
     * @param valuesOffset the offset where to start reading values
     * @param iterations   controls how much data to encode
     */
    void encode(long[] values, int valuesOffset, byte[] blocks, int blocksOffset, int iterations);

    /**
     * Read <code>iterations * valueCount()</code> values from <code>values</code>,
     * encode them and write <code>iterations * blockCount()</code> blocks into
     * <code>blocks</code>.
     *
     * @param blocks       the long blocks that hold packed integer values
     * @param blocksOffset the offset where to start writing blocks
     * @param values       the values buffer
     * @param valuesOffset the offset where to start reading values
     * @param iterations   controls how much data to encode
     */
    void encode(int[] values, int valuesOffset, long[] blocks, int blocksOffset, int iterations);

    /**
     * Read <code>iterations * valueCount()</code> values from <code>values</code>,
     * encode them and write <code>8 * iterations * blockCount()</code> blocks into
     * <code>blocks</code>.
     *
     * @param blocks       the long blocks that hold packed integer values
     * @param blocksOffset the offset where to start writing blocks
     * @param values       the values buffer
     * @param valuesOffset the offset where to start reading values
     * @param iterations   controls how much data to encode
     */
    void encode(int[] values, int valuesOffset, byte[] blocks, int blocksOffset, int iterations);

  }

/**
* A read-only random access array of positive integers.
* @lucene.internal
*/
public static interface Reader {
    /**
     * @param index the position of the wanted value.
     * @return the value at the stated index.
     */
    long get(int index);

    /**
     * Bulk get: read at least one and at most <code>len</code> longs starting
     * from <code>index</code> into <code>arr[off:off+len]</code> and return
     * the actual number of values that have been read.
     */
    int get(int index, long[] arr, int off, int len);

    /**
     * @return the number of bits used to store any given value.
     *         Note: This does not imply that memory usage is
     *         {@code bitsPerValue * #values} as implementations are free to
     *         use non-space-optimal packing of bits.
     */
    int getBitsPerValue();

    /**
     * @return the number of values.
     */
    int size();

    /**
     * Return the in-memory size in bytes.
     */
    long ramBytesUsed();

    /**
     * Expert: if the bit-width of this reader matches one of
     * java's native types, returns the underlying array
     * (ie, byte[], short[], int[], long[]); else, returns
     * null.  Note that when accessing the array you must
     * upgrade the type (bitwise AND with all ones), to
     * interpret the full value as unsigned.  Ie,
     * bytes[idx]&0xFF, shorts[idx]&0xFFFF, etc.
     */
    Object getArray();

    /**
     * Returns true if this implementation is backed by a
     * native java array.
     *
     * @see #getArray
     */
    boolean hasArray();

  }


/**
* Run-once iterator interface, to decode previously saved PackedInts.
*/
public static interface ReaderIterator {
    /** Returns next value */
    long next() throws IOException;
    /** Returns at least 1 and at most <code>count</code> next values,
     * the returned ref MUST NOT be modified */
    LongsRef next(int count) throws IOException;
    /** Returns number of bits per value */
    int getBitsPerValue();
    /** Returns number of values */
    int size();
    /** Returns the current position */
    int ord();
  }

static abstract class ReaderIteratorImpl implements ReaderIterator {

    protected final DataInput in;
    protected final int bitsPerValue;
    protected final int valueCount;

    protected ReaderIteratorImpl(int valueCount, int bitsPerValue, DataInput in) {
      this.in = in;
      this.bitsPerValue = bitsPerValue;
      this.valueCount = valueCount;
    }

    @Override
    public long next() throws IOException {
      LongsRef nextValues = next(1);
      assert nextValues.length > 0;
      final long result = nextValues.longs[nextValues.offset];
      ++nextValues.offset;
      --nextValues.length;
      return result;
    }

    @Override
    public int getBitsPerValue() {
      return bitsPerValue;
    }

    @Override
    public int size() {
      return valueCount;
    }
  }

/**
* A packed integer array that can be modified.
* @lucene.internal
*/
public static interface Mutable extends Reader {

    /**
     * Set the value at the given index in the array.
     * @param index where the value should be positioned.
     * @param value a value conforming to the constraints set by the array.
     */
    void set(int index, long value);

    /**
     * Bulk set: set at least one and at most <code>len</code> longs starting
     * at <code>off</code> in <code>arr</code> into this mutable, starting at
     * <code>index</code>. Returns the actual number of values that have been
     * set.
     */
    int set(int index, long[] arr, int off, int len);

    /**
     * Fill the mutable from <code>fromIndex</code> (inclusive) to
     * <code>toIndex</code> (exclusive) with <code>val</code>.
     */
    void fill(int fromIndex, int toIndex, long val);

    /**
     * Sets all values to 0.
     */
    void clear();

    /**
     * Save this mutable into <code>out</code>. Instantiating a reader from
     * the generated data will return a reader with the same number of bits
     * per value.
     */
    void save(DataOutput out) throws IOException;

  }

/**
* A simple base for Readers that keeps track of valueCount and bitsPerValue.
* @lucene.internal
*/
static abstract class ReaderImpl implements Reader {
    protected final int bitsPerValue;
    protected final int valueCount;

    protected ReaderImpl(int valueCount, int bitsPerValue) {
      this.bitsPerValue = bitsPerValue;
      assert bitsPerValue > 0 && bitsPerValue <= 64 : "bitsPerValue=" + bitsPerValue;
      this.valueCount = valueCount;
    }

    @Override
    public int getBitsPerValue() {
      return bitsPerValue;
    }

    @Override
    public int size() {
      return valueCount;
    }

    @Override
    public Object getArray() {
      return null;
    }

    @Override
    public boolean hasArray() {
      return false;
    }

    @Override
    public int get(int index, long[] arr, int off, int len) {
      assert len > 0 : "len must be > 0 (got " + len + ")";
      assert index >= 0 && index < valueCount;
      assert off + len <= arr.length;

      final int gets = Math.min(valueCount - index, len);
      for (int i = index, o = off, end = index + gets; i < end; ++i, ++o) {
        arr[o] = get(i);
      }
      return gets;
    }

  }

static abstract class MutableImpl extends ReaderImpl implements Mutable {

    protected MutableImpl(int valueCount, int bitsPerValue) {
      super(valueCount, bitsPerValue);
    }

    @Override
    public int set(int index, long[] arr, int off, int len) {
      assert len > 0 : "len must be > 0 (got " + len + ")";
      assert index >= 0 && index < valueCount;
      len = Math.min(len, valueCount - index);
      assert off + len <= arr.length;

      for (int i = index, o = off, end = index + len; i < end; ++i, ++o) {
        set(i, arr[o]);
      }
      return len;
    }

    @Override
    public void fill(int fromIndex, int toIndex, long val) {
      assert val <= maxValue(bitsPerValue);
      assert fromIndex <= toIndex;
      for (int i = fromIndex; i < toIndex; ++i) {
        set(i, val);
      }
    }

    protected Format getFormat() {
      return Format.PACKED;
    }

    @Override
    public void save(DataOutput out) throws IOException {
      Writer writer = getWriterNoHeader(out, getFormat(),
          valueCount, bitsPerValue, DEFAULT_BUFFER_SIZE);
      writer.writeHeader();
      for (int i = 0; i < valueCount; ++i) {
        writer.add(get(i));
      }
      writer.finish();
    }
  }

/** A {@link Reader} which has all its values equal to 0 (bitsPerValue = 0). */
public static final class NullReader implements Reader {

    private final int valueCount;

    /** Sole constructor. */
    public NullReader(int valueCount) {
      this.valueCount = valueCount;
    }

    @Override
    public long get(int index) {
      return 0;
    }

    @Override
    public int get(int index, long[] arr, int off, int len) {
      return 0;
    }

    @Override
    public int getBitsPerValue() {
      return 0;
    }

    @Override
    public int size() {
      return valueCount;
    }

    @Override
    public long ramBytesUsed() {
      return 0;
    }

    @Override
    public Object getArray() {
      return null;
    }

    @Override
    public boolean hasArray() {
      return false;
    }

  }

/** A write-once Writer.
* @lucene.internal
*/
public static abstract class Writer {
    protected final DataOutput out;
    protected final int valueCount;
    protected final int bitsPerValue;

    protected Writer(DataOutput out, int valueCount, int bitsPerValue) {
      assert bitsPerValue <= 64;
      assert valueCount >= 0 || valueCount == -1;
      this.out = out;
      this.valueCount = valueCount;
      this.bitsPerValue = bitsPerValue;
    }

    void writeHeader() throws IOException {
      assert valueCount != -1;
      CodecUtil.writeHeader(out, CODEC_NAME, VERSION_CURRENT);
      out.writeVInt(bitsPerValue);
      out.writeVInt(valueCount);
      out.writeVInt(getFormat().getId());
    }

    /** The format used to serialize values. */
    protected abstract PackedInts.Format getFormat();

    /** Add a value to the stream. */
    public abstract void add(long v) throws IOException;

    /** The number of bits per value. */
    public final int bitsPerValue() {
      return bitsPerValue;
    }

    /** Perform end-of-stream operations. */
    public abstract void finish() throws IOException;

    /**
     * Returns the current ord in the stream (number of values that have been
     * written so far minus one).
     */
    public abstract int ord();
  }


/** Header identifying the structure of a packed integer array. */
public static class Header {

    private final Format format;
    private final int valueCount;
    private final int bitsPerValue;
    private final int version;

    public Header(Format format, int valueCount, int bitsPerValue, int version) {
      this.format = format;
      this.valueCount = valueCount;
      this.bitsPerValue = bitsPerValue;
      this.version = version;
    }    
  }
  

PackedInts.FormatAndBits = FormatAndBits;
PackedInts.Format = Format;
PackedInts.Decoder = Decoder;
PackedInts.Encoder = Encoder;
PackedInts.Reader = Reader;
PackedInts.ReaderIterator = ReaderIterator;
PackedInts.Mutable = Mutable;
PackedInts.NullReader = NullReader;
PackedInts.Writer = Writer;
PackedInts.Header = Header;
module.exports = exports = PackedInts;