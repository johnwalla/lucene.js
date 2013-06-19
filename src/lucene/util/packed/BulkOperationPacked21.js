var util = require('util');
var assert = require('assert');
var defineClass = require('library/class/defineClass.js');
var Class = require('library/class/Class.js');
var BulkOperation = require('./BulkOperation.js');
var BulkOperationPacked = require('./BulkOperationPacked.js');
/**
 * Efficient sequential read/write of packed integers.
 */
var BulkOperationPacked21 = defineClass({
	name: "BulkOperationPacked21",
	extend: BulkOperationPacked,
	construct: function() {
		BulkOperationPacked.call(this, 21);
	},
	methods: {
		decodeWithLongBlockIntVal: function( /* long[ ]*/ blocks, /* int */ blocksOffset, /* int[] */ values, /* int */ valuesOffset, /* int */ iterations) {
			for (var i = 0; i < iterations; ++i) {
				var block0 = blocks[blocksOffset++];
				values[valuesOffset++] = (block0 >>> 43);
				values[valuesOffset++] = ((block0 >>> 22) & 2097151);
				values[valuesOffset++] = ((block0 >>> 1) & 2097151);
				var block1 = blocks[blocksOffset++];
				values[valuesOffset++] = (((block0 & 1) << 20) | (block1 >>> 44));
				values[valuesOffset++] = ((block1 >>> 23) & 2097151);
				values[valuesOffset++] = ((block1 >>> 2) & 2097151);
				var block2 = blocks[blocksOffset++];
				values[valuesOffset++] = (((block1 & 3) << 19) | (block2 >>> 45));
				values[valuesOffset++] = ((block2 >>> 24) & 2097151);
				values[valuesOffset++] = ((block2 >>> 3) & 2097151);
				var block3 = blocks[blocksOffset++];
				values[valuesOffset++] = (((block2 & 7) << 18) | (block3 >>> 46));
				values[valuesOffset++] = ((block3 >>> 25) & 2097151);
				values[valuesOffset++] = ((block3 >>> 4) & 2097151);
				var block4 = blocks[blocksOffset++];
				values[valuesOffset++] = (((block3 & 15) << 17) | (block4 >>> 47));
				values[valuesOffset++] = ((block4 >>> 26) & 2097151);
				values[valuesOffset++] = ((block4 >>> 5) & 2097151);
				var block5 = blocks[blocksOffset++];
				values[valuesOffset++] = (((block4 & 31) << 16) | (block5 >>> 48));
				values[valuesOffset++] = ((block5 >>> 27) & 2097151);
				values[valuesOffset++] = ((block5 >>> 6) & 2097151);
				var block6 = blocks[blocksOffset++];
				values[valuesOffset++] = (((block5 & 63) << 15) | (block6 >>> 49));
				values[valuesOffset++] = ((block6 >>> 28) & 2097151);
				values[valuesOffset++] = ((block6 >>> 7) & 2097151);
				var block7 = blocks[blocksOffset++];
				values[valuesOffset++] = (((block6 & 127) << 14) | (block7 >>> 50));
				values[valuesOffset++] = ((block7 >>> 29) & 2097151);
				values[valuesOffset++] = ((block7 >>> 8) & 2097151);
				var block8 = blocks[blocksOffset++];
				values[valuesOffset++] = (((block7 & 255) << 13) | (block8 >>> 51));
				values[valuesOffset++] = ((block8 >>> 30) & 2097151);
				values[valuesOffset++] = ((block8 >>> 9) & 2097151);
				var block9 = blocks[blocksOffset++];
				values[valuesOffset++] = (((block8 & 511) << 12) | (block9 >>> 52));
				values[valuesOffset++] = ((block9 >>> 31) & 2097151);
				values[valuesOffset++] = ((block9 >>> 10) & 2097151);
				var block10 = blocks[blocksOffset++];
				values[valuesOffset++] = (((block9 & 1023) << 11) | (block10 >>> 53));
				values[valuesOffset++] = ((block10 >>> 32) & 2097151);
				values[valuesOffset++] = ((block10 >>> 11) & 2097151);
				var block11 = blocks[blocksOffset++];
				values[valuesOffset++] = (((block10 & 2047) << 10) | (block11 >>> 54));
				values[valuesOffset++] = ((block11 >>> 33) & 2097151);
				values[valuesOffset++] = ((block11 >>> 12) & 2097151);
				var block12 = blocks[blocksOffset++];
				values[valuesOffset++] = (((block11 & 4095) << 9) | (block12 >>> 55));
				values[valuesOffset++] = ((block12 >>> 34) & 2097151);
				values[valuesOffset++] = ((block12 >>> 13) & 2097151);
				var block13 = blocks[blocksOffset++];
				values[valuesOffset++] = (((block12 & 8191) << 8) | (block13 >>> 56));
				values[valuesOffset++] = ((block13 >>> 35) & 2097151);
				values[valuesOffset++] = ((block13 >>> 14) & 2097151);
				var block14 = blocks[blocksOffset++];
				values[valuesOffset++] = (((block13 & 16383) << 7) | (block14 >>> 57));
				values[valuesOffset++] = ((block14 >>> 36) & 2097151);
				values[valuesOffset++] = ((block14 >>> 15) & 2097151);
				var block15 = blocks[blocksOffset++];
				values[valuesOffset++] = (((block14 & 32767) << 6) | (block15 >>> 58));
				values[valuesOffset++] = ((block15 >>> 37) & 2097151);
				values[valuesOffset++] = ((block15 >>> 16) & 2097151);
				var block16 = blocks[blocksOffset++];
				values[valuesOffset++] = (((block15 & 65535) << 5) | (block16 >>> 59));
				values[valuesOffset++] = ((block16 >>> 38) & 2097151);
				values[valuesOffset++] = ((block16 >>> 17) & 2097151);
				var block17 = blocks[blocksOffset++];
				values[valuesOffset++] = (((block16 & 131071) << 4) | (block17 >>> 60));
				values[valuesOffset++] = ((block17 >>> 39) & 2097151);
				values[valuesOffset++] = ((block17 >>> 18) & 2097151);
				var block18 = blocks[blocksOffset++];
				values[valuesOffset++] = (((block17 & 262143) << 3) | (block18 >>> 61));
				values[valuesOffset++] = ((block18 >>> 40) & 2097151);
				values[valuesOffset++] = ((block18 >>> 19) & 2097151);
				var block19 = blocks[blocksOffset++];
				values[valuesOffset++] = (((block18 & 524287) << 2) | (block19 >>> 62));
				values[valuesOffset++] = ((block19 >>> 41) & 2097151);
				values[valuesOffset++] = ((block19 >>> 20) & 2097151);
				var block20 = blocks[blocksOffset++];
				values[valuesOffset++] = (((block19 & 1048575) << 1) | (block20 >>> 63));
				values[valuesOffset++] = ((block20 >>> 42) & 2097151);
				values[valuesOffset++] = ((block20 >>> 21) & 2097151);
				values[valuesOffset++] = (block20 & 2097151);
			}
		},
		decodeWithByteBlockIntVal: function( /* byte[] */ blocks, /* int */ blocksOffset, /* int[] */ values, /* int */ valuesOffset, /* int */ iterations) {
			for (var i = 0; i < iterations; ++i) {
				var byte0 = blocks[blocksOffset++] & 0xFF;
				var byte1 = blocks[blocksOffset++] & 0xFF;
				var byte2 = blocks[blocksOffset++] & 0xFF;
				values[valuesOffset++] = (byte0 << 13) | (byte1 << 5) | (byte2 >>> 3);
				var byte3 = blocks[blocksOffset++] & 0xFF;
				var byte4 = blocks[blocksOffset++] & 0xFF;
				var byte5 = blocks[blocksOffset++] & 0xFF;
				values[valuesOffset++] = ((byte2 & 7) << 18) | (byte3 << 10) | (byte4 << 2) | (byte5 >>> 6);
				var byte6 = blocks[blocksOffset++] & 0xFF;
				var byte7 = blocks[blocksOffset++] & 0xFF;
				values[valuesOffset++] = ((byte5 & 63) << 15) | (byte6 << 7) | (byte7 >>> 1);
				var byte8 = blocks[blocksOffset++] & 0xFF;
				var byte9 = blocks[blocksOffset++] & 0xFF;
				var byte10 = blocks[blocksOffset++] & 0xFF;
				values[valuesOffset++] = ((byte7 & 1) << 20) | (byte8 << 12) | (byte9 << 4) | (byte10 >>> 4);
				var byte11 = blocks[blocksOffset++] & 0xFF;
				var byte12 = blocks[blocksOffset++] & 0xFF;
				var byte13 = blocks[blocksOffset++] & 0xFF;
				values[valuesOffset++] = ((byte10 & 15) << 17) | (byte11 << 9) | (byte12 << 1) | (byte13 >>> 7);
				var byte14 = blocks[blocksOffset++] & 0xFF;
				var byte15 = blocks[blocksOffset++] & 0xFF;
				values[valuesOffset++] = ((byte13 & 127) << 14) | (byte14 << 6) | (byte15 >>> 2);
				var byte16 = blocks[blocksOffset++] & 0xFF;
				var byte17 = blocks[blocksOffset++] & 0xFF;
				var byte18 = blocks[blocksOffset++] & 0xFF;
				values[valuesOffset++] = ((byte15 & 3) << 19) | (byte16 << 11) | (byte17 << 3) | (byte18 >>> 5);
				var byte19 = blocks[blocksOffset++] & 0xFF;
				var byte20 = blocks[blocksOffset++] & 0xFF;
				values[valuesOffset++] = ((byte18 & 31) << 16) | (byte19 << 8) | byte20;
			}
		}
		decodeWithLongBlockLongVal: function( /* long[] */ blocks, /* int */ blocksOffset, /* long[] */ values, /* int */ valuesOffset, /* int */ iterations) {
			for (var i = 0; i < iterations; ++i) {
				var block0 = blocks[blocksOffset++];
				values[valuesOffset++] = block0 >>> 43;
				values[valuesOffset++] = (block0 >>> 22) & 2097151;
				values[valuesOffset++] = (block0 >>> 1) & 2097151;
				var block1 = blocks[blocksOffset++];
				values[valuesOffset++] = ((block0 & 1) << 20) | (block1 >>> 44);
				values[valuesOffset++] = (block1 >>> 23) & 2097151;
				values[valuesOffset++] = (block1 >>> 2) & 2097151;
				var block2 = blocks[blocksOffset++];
				values[valuesOffset++] = ((block1 & 3) << 19) | (block2 >>> 45);
				values[valuesOffset++] = (block2 >>> 24) & 2097151;
				values[valuesOffset++] = (block2 >>> 3) & 2097151;
				var block3 = blocks[blocksOffset++];
				values[valuesOffset++] = ((block2 & 7) << 18) | (block3 >>> 46);
				values[valuesOffset++] = (block3 >>> 25) & 2097151;
				values[valuesOffset++] = (block3 >>> 4) & 2097151;
				var block4 = blocks[blocksOffset++];
				values[valuesOffset++] = ((block3 & 15) << 17) | (block4 >>> 47);
				values[valuesOffset++] = (block4 >>> 26) & 2097151;
				values[valuesOffset++] = (block4 >>> 5) & 2097151;
				var block5 = blocks[blocksOffset++];
				values[valuesOffset++] = ((block4 & 31) << 16) | (block5 >>> 48);
				values[valuesOffset++] = (block5 >>> 27) & 2097151;
				values[valuesOffset++] = (block5 >>> 6) & 2097151;
				var block6 = blocks[blocksOffset++];
				values[valuesOffset++] = ((block5 & 63) << 15) | (block6 >>> 49);
				values[valuesOffset++] = (block6 >>> 28) & 2097151;
				values[valuesOffset++] = (block6 >>> 7) & 2097151;
				var block7 = blocks[blocksOffset++];
				values[valuesOffset++] = ((block6 & 127) << 14) | (block7 >>> 50);
				values[valuesOffset++] = (block7 >>> 29) & 2097151;
				values[valuesOffset++] = (block7 >>> 8) & 2097151;
				var block8 = blocks[blocksOffset++];
				values[valuesOffset++] = ((block7 & 255) << 13) | (block8 >>> 51);
				values[valuesOffset++] = (block8 >>> 30) & 2097151;
				values[valuesOffset++] = (block8 >>> 9) & 2097151;
				var block9 = blocks[blocksOffset++];
				values[valuesOffset++] = ((block8 & 511) << 12) | (block9 >>> 52);
				values[valuesOffset++] = (block9 >>> 31) & 2097151;
				values[valuesOffset++] = (block9 >>> 10) & 2097151;
				var block10 = blocks[blocksOffset++];
				values[valuesOffset++] = ((block9 & 1023) << 11) | (block10 >>> 53);
				values[valuesOffset++] = (block10 >>> 32) & 2097151;
				values[valuesOffset++] = (block10 >>> 11) & 2097151;
				var block11 = blocks[blocksOffset++];
				values[valuesOffset++] = ((block10 & 2047) << 10) | (block11 >>> 54);
				values[valuesOffset++] = (block11 >>> 33) & 2097151;
				values[valuesOffset++] = (block11 >>> 12) & 2097151;
				var block12 = blocks[blocksOffset++];
				values[valuesOffset++] = ((block11 & 4095) << 9) | (block12 >>> 55);
				values[valuesOffset++] = (block12 >>> 34) & 2097151;
				values[valuesOffset++] = (block12 >>> 13) & 2097151;
				var block13 = blocks[blocksOffset++];
				values[valuesOffset++] = ((block12 & 8191) << 8) | (block13 >>> 56);
				values[valuesOffset++] = (block13 >>> 35) & 2097151;
				values[valuesOffset++] = (block13 >>> 14) & 2097151;
				var block14 = blocks[blocksOffset++];
				values[valuesOffset++] = ((block13 & 16383) << 7) | (block14 >>> 57);
				values[valuesOffset++] = (block14 >>> 36) & 2097151;
				values[valuesOffset++] = (block14 >>> 15) & 2097151;
				var block15 = blocks[blocksOffset++];
				values[valuesOffset++] = ((block14 & 32767) << 6) | (block15 >>> 58);
				values[valuesOffset++] = (block15 >>> 37) & 2097151;
				values[valuesOffset++] = (block15 >>> 16) & 2097151;
				var block16 = blocks[blocksOffset++];
				values[valuesOffset++] = ((block15 & 65535) << 5) | (block16 >>> 59);
				values[valuesOffset++] = (block16 >>> 38) & 2097151;
				values[valuesOffset++] = (block16 >>> 17) & 2097151;
				var block17 = blocks[blocksOffset++];
				values[valuesOffset++] = ((block16 & 131071) << 4) | (block17 >>> 60);
				values[valuesOffset++] = (block17 >>> 39) & 2097151;
				values[valuesOffset++] = (block17 >>> 18) & 2097151;
				var block18 = blocks[blocksOffset++];
				values[valuesOffset++] = ((block17 & 262143) << 3) | (block18 >>> 61);
				values[valuesOffset++] = (block18 >>> 40) & 2097151;
				values[valuesOffset++] = (block18 >>> 19) & 2097151;
				var block19 = blocks[blocksOffset++];
				values[valuesOffset++] = ((block18 & 524287) << 2) | (block19 >>> 62);
				values[valuesOffset++] = (block19 >>> 41) & 2097151;
				values[valuesOffset++] = (block19 >>> 20) & 2097151;
				var block20 = blocks[blocksOffset++];
				values[valuesOffset++] = ((block19 & 1048575) << 1) | (block20 >>> 63);
				values[valuesOffset++] = (block20 >>> 42) & 2097151;
				values[valuesOffset++] = (block20 >>> 21) & 2097151;
				values[valuesOffset++] = block20 & 2097151;
			}
		},
		decodeWithByteBlockLongVal: function( /* byte[] */ blocks, /* int */ blocksOffset, /* long[] */ values, /* int */ valuesOffset, /* int */ iterations) {
			for (var i = 0; i < iterations; ++i) {
				var byte0 = blocks[blocksOffset++] & 0xFF;
				var byte1 = blocks[blocksOffset++] & 0xFF;
				var byte2 = blocks[blocksOffset++] & 0xFF;
				values[valuesOffset++] = (byte0 << 13) | (byte1 << 5) | (byte2 >>> 3);
				var byte3 = blocks[blocksOffset++] & 0xFF;
				var byte4 = blocks[blocksOffset++] & 0xFF;
				var byte5 = blocks[blocksOffset++] & 0xFF;
				values[valuesOffset++] = ((byte2 & 7) << 18) | (byte3 << 10) | (byte4 << 2) | (byte5 >>> 6);
				var byte6 = blocks[blocksOffset++] & 0xFF;
				var byte7 = blocks[blocksOffset++] & 0xFF;
				values[valuesOffset++] = ((byte5 & 63) << 15) | (byte6 << 7) | (byte7 >>> 1);
				var byte8 = blocks[blocksOffset++] & 0xFF;
				var byte9 = blocks[blocksOffset++] & 0xFF;
				var byte10 = blocks[blocksOffset++] & 0xFF;
				values[valuesOffset++] = ((byte7 & 1) << 20) | (byte8 << 12) | (byte9 << 4) | (byte10 >>> 4);
				var byte11 = blocks[blocksOffset++] & 0xFF;
				var byte12 = blocks[blocksOffset++] & 0xFF;
				var byte13 = blocks[blocksOffset++] & 0xFF;
				values[valuesOffset++] = ((byte10 & 15) << 17) | (byte11 << 9) | (byte12 << 1) | (byte13 >>> 7);
				var byte14 = blocks[blocksOffset++] & 0xFF;
				var byte15 = blocks[blocksOffset++] & 0xFF;
				values[valuesOffset++] = ((byte13 & 127) << 14) | (byte14 << 6) | (byte15 >>> 2);
				var byte16 = blocks[blocksOffset++] & 0xFF;
				var byte17 = blocks[blocksOffset++] & 0xFF;
				var byte18 = blocks[blocksOffset++] & 0xFF;
				values[valuesOffset++] = ((byte15 & 3) << 19) | (byte16 << 11) | (byte17 << 3) | (byte18 >>> 5);
				var byte19 = blocks[blocksOffset++] & 0xFF;
				var byte20 = blocks[blocksOffset++] & 0xFF;
				values[valuesOffset++] = ((byte18 & 31) << 16) | (byte19 << 8) | byte20;
			}
		}
	}
});
module.exports = exports = BulkOperationPacked21;