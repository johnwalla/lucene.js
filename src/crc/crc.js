//REFERENCE https://github.com/alexgorbatchev/node-crc
// CRC-8 in table form
// 
// Copyright (c) 1989 AnDan Software. You may use this program, or
// code or tables extracted from it, as long as this notice is not
// removed or changed.
var CRC8_TAB = new Array(
// C/C++ language:
// 
// unsigned char CRC8_TAB[] = {...};
0x00, 0x1B, 0x36, 0x2D, 0x6C, 0x77, 0x5A, 0x41, 0xD8, 0xC3, 0xEE, 0xF5, 0xB4, 0xAF, 0x82, 0x99, 0xD3, 0xC8, 0xE5, 0xFE, 0xBF, 0xA4, 0x89, 0x92, 0x0B, 0x10, 0x3D, 0x26, 0x67, 0x7C, 0x51, 0x4A, 0xC5, 0xDE, 0xF3, 0xE8, 0xA9, 0xB2, 0x9F, 0x84, 0x1D, 0x06, 0x2B, 0x30, 0x71, 0x6A, 0x47, 0x5C, 0x16, 0x0D, 0x20, 0x3B, 0x7A, 0x61, 0x4C, 0x57, 0xCE, 0xD5, 0xF8, 0xE3, 0xA2, 0xB9, 0x94, 0x8F, 0xE9, 0xF2, 0xDF, 0xC4, 0x85, 0x9E, 0xB3, 0xA8, 0x31, 0x2A, 0x07, 0x1C, 0x5D, 0x46, 0x6B, 0x70, 0x3A, 0x21, 0x0C, 0x17, 0x56, 0x4D, 0x60, 0x7B, 0xE2, 0xF9, 0xD4, 0xCF, 0x8E, 0x95, 0xB8, 0xA3, 0x2C, 0x37, 0x1A, 0x01, 0x40, 0x5B, 0x76, 0x6D, 0xF4, 0xEF, 0xC2, 0xD9, 0x98, 0x83, 0xAE, 0xB5, 0xFF, 0xE4, 0xC9, 0xD2, 0x93, 0x88, 0xA5, 0xBE, 0x27, 0x3C, 0x11, 0x0A, 0x4B, 0x50, 0x7D, 0x66, 0xB1, 0xAA, 0x87, 0x9C, 0xDD, 0xC6, 0xEB, 0xF0, 0x69, 0x72, 0x5F, 0x44, 0x05, 0x1E, 0x33, 0x28, 0x62, 0x79, 0x54, 0x4F, 0x0E, 0x15, 0x38, 0x23, 0xBA, 0xA1, 0x8C, 0x97, 0xD6, 0xCD, 0xE0, 0xFB, 0x74, 0x6F, 0x42, 0x59, 0x18, 0x03, 0x2E, 0x35, 0xAC, 0xB7, 0x9A, 0x81, 0xC0, 0xDB, 0xF6, 0xED, 0xA7, 0xBC, 0x91, 0x8A, 0xCB, 0xD0, 0xFD, 0xE6, 0x7F, 0x64, 0x49, 0x52, 0x13, 0x08, 0x25, 0x3E, 0x58, 0x43, 0x6E, 0x75, 0x34, 0x2F, 0x02, 0x19, 0x80, 0x9B, 0xB6, 0xAD, 0xEC, 0xF7, 0xDA, 0xC1, 0x8B, 0x90, 0xBD, 0xA6, 0xE7, 0xFC, 0xD1, 0xCA, 0x53, 0x48, 0x65, 0x7E, 0x3F, 0x24, 0x09, 0x12, 0x9D, 0x86, 0xAB, 0xB0, 0xF1, 0xEA, 0xC7, 0xDC, 0x45, 0x5E, 0x73, 0x68, 0x29, 0x32, 0x1F, 0x04, 0x4E, 0x55, 0x78, 0x63, 0x22, 0x39, 0x14, 0x0F, 0x96, 0x8D, 0xA0, 0xBB, 0xFA, 0xE1, 0xCC, 0xD7);

function crc8Add(crc, c)
// 'crc' should be initialized to 0x00.
{
	return CRC8_TAB[(crc ^ c) & 0xFF];
};
// C/C++ language:
// 
// inline unsigned char crc8Add(unsigned char crc, unsigned char c)
// {
// 	return CRC8_TAB[crc^c];
// }
// CRC-16 (as it is in SEA's ARC) in table form
// 
// The logic for this method of calculating the CRC 16 bit polynomial
// is taken from an article by David Schwaderer in the April 1985
// issue of PC Tech Journal.
var CRC_ARC_TAB = new Array(
// THIS TABLE IS THE RIGHT ONE FOR MODBUS CALCULATIONS
// C/C++ language:
// unsigned short CRC_ARC_TAB[] = {...};
0x0000, 0xC0C1, 0xC181, 0x0140, 0xC301, 0x03C0, 0x0280, 0xC241, 0xC601, 0x06C0, 0x0780, 0xC741, 0x0500, 0xC5C1, 0xC481, 0x0440, 0xCC01, 0x0CC0, 0x0D80, 0xCD41, 0x0F00, 0xCFC1, 0xCE81, 0x0E40, 0x0A00, 0xCAC1, 0xCB81, 0x0B40, 0xC901, 0x09C0, 0x0880, 0xC841, 0xD801, 0x18C0, 0x1980, 0xD941, 0x1B00, 0xDBC1, 0xDA81, 0x1A40, 0x1E00, 0xDEC1, 0xDF81, 0x1F40, 0xDD01, 0x1DC0, 0x1C80, 0xDC41, 0x1400, 0xD4C1, 0xD581, 0x1540, 0xD701, 0x17C0, 0x1680, 0xD641, 0xD201, 0x12C0, 0x1380, 0xD341, 0x1100, 0xD1C1, 0xD081, 0x1040, 0xF001, 0x30C0, 0x3180, 0xF141, 0x3300, 0xF3C1, 0xF281, 0x3240, 0x3600, 0xF6C1, 0xF781, 0x3740, 0xF501, 0x35C0, 0x3480, 0xF441, 0x3C00, 0xFCC1, 0xFD81, 0x3D40, 0xFF01, 0x3FC0, 0x3E80, 0xFE41, 0xFA01, 0x3AC0, 0x3B80, 0xFB41, 0x3900, 0xF9C1, 0xF881, 0x3840, 0x2800, 0xE8C1, 0xE981, 0x2940, 0xEB01, 0x2BC0, 0x2A80, 0xEA41, 0xEE01, 0x2EC0, 0x2F80, 0xEF41, 0x2D00, 0xEDC1, 0xEC81, 0x2C40, 0xE401, 0x24C0, 0x2580, 0xE541, 0x2700, 0xE7C1, 0xE681, 0x2640, 0x2200, 0xE2C1, 0xE381, 0x2340, 0xE101, 0x21C0, 0x2080, 0xE041, 0xA001, 0x60C0, 0x6180, 0xA141, 0x6300, 0xA3C1, 0xA281, 0x6240, 0x6600, 0xA6C1, 0xA781, 0x6740, 0xA501, 0x65C0, 0x6480, 0xA441, 0x6C00, 0xACC1, 0xAD81, 0x6D40, 0xAF01, 0x6FC0, 0x6E80, 0xAE41, 0xAA01, 0x6AC0, 0x6B80, 0xAB41, 0x6900, 0xA9C1, 0xA881, 0x6840, 0x7800, 0xB8C1, 0xB981, 0x7940, 0xBB01, 0x7BC0, 0x7A80, 0xBA41, 0xBE01, 0x7EC0, 0x7F80, 0xBF41, 0x7D00, 0xBDC1, 0xBC81, 0x7C40, 0xB401, 0x74C0, 0x7580, 0xB541, 0x7700, 0xB7C1, 0xB681, 0x7640, 0x7200, 0xB2C1, 0xB381, 0x7340, 0xB101, 0x71C0, 0x7080, 0xB041, 0x5000, 0x90C1, 0x9181, 0x5140, 0x9301, 0x53C0, 0x5280, 0x9241, 0x9601, 0x56C0, 0x5780, 0x9741, 0x5500, 0x95C1, 0x9481, 0x5440, 0x9C01, 0x5CC0, 0x5D80, 0x9D41, 0x5F00, 0x9FC1, 0x9E81, 0x5E40, 0x5A00, 0x9AC1, 0x9B81, 0x5B40, 0x9901, 0x59C0, 0x5880, 0x9841, 0x8801, 0x48C0, 0x4980, 0x8941, 0x4B00, 0x8BC1, 0x8A81, 0x4A40, 0x4E00, 0x8EC1, 0x8F81, 0x4F40, 0x8D01, 0x4DC0, 0x4C80, 0x8C41, 0x4400, 0x84C1, 0x8581, 0x4540, 0x8701, 0x47C0, 0x4680, 0x8641, 0x8201, 0x42C0, 0x4380, 0x8341, 0x4100, 0x81C1, 0x8081, 0x4040);

function crcArcAdd(crc, c)
// 'crc' should be initialized to 0x0000.
{
	return CRC_ARC_TAB[(crc ^ c) & 0xFF] ^ ((crc >> 8) & 0xFF);
};
// C/C++ language:
// 
// inline unsigned short crcArcAdd(unsigned short crc, unsigned char c)
// {
// 	return CRC_ARC_TAB[(unsigned char)crc^c]^(unsigned short)(crc>>8);
// }
// CRC-16 (as it is in ZMODEM) in table form
// 
// Copyright (c) 1989 AnDan Software. You may use this program, or
// code or tables extracted from it, as long as this notice is not
// removed or changed.
var CRC16_TAB = new Array(
// C/C++ language:
// 
// unsigned short CRC16_TAB[] = {...};
0x0000, 0x1021, 0x2042, 0x3063, 0x4084, 0x50A5, 0x60C6, 0x70E7, 0x8108, 0x9129, 0xA14A, 0xB16B, 0xC18C, 0xD1AD, 0xE1CE, 0xF1EF, 0x1231, 0x0210, 0x3273, 0x2252, 0x52B5, 0x4294, 0x72F7, 0x62D6, 0x9339, 0x8318, 0xB37B, 0xA35A, 0xD3BD, 0xC39C, 0xF3FF, 0xE3DE, 0x2462, 0x3443, 0x0420, 0x1401, 0x64E6, 0x74C7, 0x44A4, 0x5485, 0xA56A, 0xB54B, 0x8528, 0x9509, 0xE5EE, 0xF5CF, 0xC5AC, 0xD58D, 0x3653, 0x2672, 0x1611, 0x0630, 0x76D7, 0x66F6, 0x5695, 0x46B4, 0xB75B, 0xA77A, 0x9719, 0x8738, 0xF7DF, 0xE7FE, 0xD79D, 0xC7BC, 0x48C4, 0x58E5, 0x6886, 0x78A7, 0x0840, 0x1861, 0x2802, 0x3823, 0xC9CC, 0xD9ED, 0xE98E, 0xF9AF, 0x8948, 0x9969, 0xA90A, 0xB92B, 0x5AF5, 0x4AD4, 0x7AB7, 0x6A96, 0x1A71, 0x0A50, 0x3A33, 0x2A12, 0xDBFD, 0xCBDC, 0xFBBF, 0xEB9E, 0x9B79, 0x8B58, 0xBB3B, 0xAB1A, 0x6CA6, 0x7C87, 0x4CE4, 0x5CC5, 0x2C22, 0x3C03, 0x0C60, 0x1C41, 0xEDAE, 0xFD8F, 0xCDEC, 0xDDCD, 0xAD2A, 0xBD0B, 0x8D68, 0x9D49, 0x7E97, 0x6EB6, 0x5ED5, 0x4EF4, 0x3E13, 0x2E32, 0x1E51, 0x0E70, 0xFF9F, 0xEFBE, 0xDFDD, 0xCFFC, 0xBF1B, 0xAF3A, 0x9F59, 0x8F78, 0x9188, 0x81A9, 0xB1CA, 0xA1EB, 0xD10C, 0xC12D, 0xF14E, 0xE16F, 0x1080, 0x00A1, 0x30C2, 0x20E3, 0x5004, 0x4025, 0x7046, 0x6067, 0x83B9, 0x9398, 0xA3FB, 0xB3DA, 0xC33D, 0xD31C, 0xE37F, 0xF35E, 0x02B1, 0x1290, 0x22F3, 0x32D2, 0x4235, 0x5214, 0x6277, 0x7256, 0xB5EA, 0xA5CB, 0x95A8, 0x8589, 0xF56E, 0xE54F, 0xD52C, 0xC50D, 0x34E2, 0x24C3, 0x14A0, 0x0481, 0x7466, 0x6447, 0x5424, 0x4405, 0xA7DB, 0xB7FA, 0x8799, 0x97B8, 0xE75F, 0xF77E, 0xC71D, 0xD73C, 0x26D3, 0x36F2, 0x0691, 0x16B0, 0x6657, 0x7676, 0x4615, 0x5634, 0xD94C, 0xC96D, 0xF90E, 0xE92F, 0x99C8, 0x89E9, 0xB98A, 0xA9AB, 0x5844, 0x4865, 0x7806, 0x6827, 0x18C0, 0x08E1, 0x3882, 0x28A3, 0xCB7D, 0xDB5C, 0xEB3F, 0xFB1E, 0x8BF9, 0x9BD8, 0xABBB, 0xBB9A, 0x4A75, 0x5A54, 0x6A37, 0x7A16, 0x0AF1, 0x1AD0, 0x2AB3, 0x3A92, 0xFD2E, 0xED0F, 0xDD6C, 0xCD4D, 0xBDAA, 0xAD8B, 0x9DE8, 0x8DC9, 0x7C26, 0x6C07, 0x5C64, 0x4C45, 0x3CA2, 0x2C83, 0x1CE0, 0x0CC1, 0xEF1F, 0xFF3E, 0xCF5D, 0xDF7C, 0xAF9B, 0xBFBA, 0x8FD9, 0x9FF8, 0x6E17, 0x7E36, 0x4E55, 0x5E74, 0x2E93, 0x3EB2, 0x0ED1, 0x1EF0);

function crc16Add(crc, c)
// 'crc' should be initialized to 0x0000.
{
	return CRC16_TAB[((crc >> 8) ^ c) & 0xFF] ^ ((crc << 8) & 0xFFFF);
};
// C/C++ language:
// 
// inline unsigned short crc16Add(unsigned short crc, unsigned char c)
// {
// 	return CRC16_TAB[(unsigned char)(crc>>8)^c]^(unsigned short)(crc<<8);
// }
// FCS-16 (as it is in PPP) in table form
// 
// Described in RFC-1662 by William Allen Simpson, see RFC-1662 for references.
// 
// Modified by Anders Danielsson, March 10, 2006.
var FCS_16_TAB = new Array(
// C/C++ language:
// 
// unsigned short FCS_16_TAB[256] = {...};
0x0000, 0x1189, 0x2312, 0x329B, 0x4624, 0x57AD, 0x6536, 0x74BF, 0x8C48, 0x9DC1, 0xAF5A, 0xBED3, 0xCA6C, 0xDBE5, 0xE97E, 0xF8F7, 0x1081, 0x0108, 0x3393, 0x221A, 0x56A5, 0x472C, 0x75B7, 0x643E, 0x9CC9, 0x8D40, 0xBFDB, 0xAE52, 0xDAED, 0xCB64, 0xF9FF, 0xE876, 0x2102, 0x308B, 0x0210, 0x1399, 0x6726, 0x76AF, 0x4434, 0x55BD, 0xAD4A, 0xBCC3, 0x8E58, 0x9FD1, 0xEB6E, 0xFAE7, 0xC87C, 0xD9F5, 0x3183, 0x200A, 0x1291, 0x0318, 0x77A7, 0x662E, 0x54B5, 0x453C, 0xBDCB, 0xAC42, 0x9ED9, 0x8F50, 0xFBEF, 0xEA66, 0xD8FD, 0xC974, 0x4204, 0x538D, 0x6116, 0x709F, 0x0420, 0x15A9, 0x2732, 0x36BB, 0xCE4C, 0xDFC5, 0xED5E, 0xFCD7, 0x8868, 0x99E1, 0xAB7A, 0xBAF3, 0x5285, 0x430C, 0x7197, 0x601E, 0x14A1, 0x0528, 0x37B3, 0x263A, 0xDECD, 0xCF44, 0xFDDF, 0xEC56, 0x98E9, 0x8960, 0xBBFB, 0xAA72, 0x6306, 0x728F, 0x4014, 0x519D, 0x2522, 0x34AB, 0x0630, 0x17B9, 0xEF4E, 0xFEC7, 0xCC5C, 0xDDD5, 0xA96A, 0xB8E3, 0x8A78, 0x9BF1, 0x7387, 0x620E, 0x5095, 0x411C, 0x35A3, 0x242A, 0x16B1, 0x0738, 0xFFCF, 0xEE46, 0xDCDD, 0xCD54, 0xB9EB, 0xA862, 0x9AF9, 0x8B70, 0x8408, 0x9581, 0xA71A, 0xB693, 0xC22C, 0xD3A5, 0xE13E, 0xF0B7, 0x0840, 0x19C9, 0x2B52, 0x3ADB, 0x4E64, 0x5FED, 0x6D76, 0x7CFF, 0x9489, 0x8500, 0xB79B, 0xA612, 0xD2AD, 0xC324, 0xF1BF, 0xE036, 0x18C1, 0x0948, 0x3BD3, 0x2A5A, 0x5EE5, 0x4F6C, 0x7DF7, 0x6C7E, 0xA50A, 0xB483, 0x8618, 0x9791, 0xE32E, 0xF2A7, 0xC03C, 0xD1B5, 0x2942, 0x38CB, 0x0A50, 0x1BD9, 0x6F66, 0x7EEF, 0x4C74, 0x5DFD, 0xB58B, 0xA402, 0x9699, 0x8710, 0xF3AF, 0xE226, 0xD0BD, 0xC134, 0x39C3, 0x284A, 0x1AD1, 0x0B58, 0x7FE7, 0x6E6E, 0x5CF5, 0x4D7C, 0xC60C, 0xD785, 0xE51E, 0xF497, 0x8028, 0x91A1, 0xA33A, 0xB2B3, 0x4A44, 0x5BCD, 0x6956, 0x78DF, 0x0C60, 0x1DE9, 0x2F72, 0x3EFB, 0xD68D, 0xC704, 0xF59F, 0xE416, 0x90A9, 0x8120, 0xB3BB, 0xA232, 0x5AC5, 0x4B4C, 0x79D7, 0x685E, 0x1CE1, 0x0D68, 0x3FF3, 0x2E7A, 0xE70E, 0xF687, 0xC41C, 0xD595, 0xA12A, 0xB0A3, 0x8238, 0x93B1, 0x6B46, 0x7ACF, 0x4854, 0x59DD, 0x2D62, 0x3CEB, 0x0E70, 0x1FF9, 0xF78F, 0xE606, 0xD49D, 0xC514, 0xB1AB, 0xA022, 0x92B9, 0x8330, 0x7BC7, 0x6A4E, 0x58D5, 0x495C, 0x3DE3, 0x2C6A, 0x1EF1, 0x0F78);

function fcs16Add(fcs, c)
// 'fcs' should be initialized to 0xFFFF and after the computation it should be
// complemented (inverted).
// 
// If the FCS-16 is calculated over the data and over the complemented FCS-16, the
// result will always be 0xF0B8 (without the complementation).
{
	return FCS_16_TAB[(fcs ^ c) & 0xFF] ^ ((fcs >> 8) & 0xFF);
};
// C/C++ language:
// 
// inline unsigned short fcs16Add(unsigned short fcs, unsigned char c)
// {
// 	return FCS_16_TAB[(unsigned char)fcs^c]^(unsigned short)(fcs>>8);
// }
//
// CRC-32 (as it is in ZMODEM) in table form
// 
// Copyright (C) 1986 Gary S. Brown. You may use this program, or
// code or tables extracted from it, as desired without restriction.
// 
// Modified by Anders Danielsson, February 5, 1989 and March 10, 2006.
// 
// This is also known as FCS-32 (as it is in PPP), described in
// RFC-1662 by William Allen Simpson, see RFC-1662 for references.
// 
var CRC32_TAB = new Array( /* CRC polynomial 0xEDB88320 */
// C/C++ language:
// 
// unsigned long CRC32_TAB[] = {...};
0x00000000, 0x77073096, 0xEE0E612C, 0x990951BA, 0x076DC419, 0x706AF48F, 0xE963A535, 0x9E6495A3, 0x0EDB8832, 0x79DCB8A4, 0xE0D5E91E, 0x97D2D988, 0x09B64C2B, 0x7EB17CBD, 0xE7B82D07, 0x90BF1D91, 0x1DB71064, 0x6AB020F2, 0xF3B97148, 0x84BE41DE, 0x1ADAD47D, 0x6DDDE4EB, 0xF4D4B551, 0x83D385C7, 0x136C9856, 0x646BA8C0, 0xFD62F97A, 0x8A65C9EC, 0x14015C4F, 0x63066CD9, 0xFA0F3D63, 0x8D080DF5, 0x3B6E20C8, 0x4C69105E, 0xD56041E4, 0xA2677172, 0x3C03E4D1, 0x4B04D447, 0xD20D85FD, 0xA50AB56B, 0x35B5A8FA, 0x42B2986C, 0xDBBBC9D6, 0xACBCF940, 0x32D86CE3, 0x45DF5C75, 0xDCD60DCF, 0xABD13D59, 0x26D930AC, 0x51DE003A, 0xC8D75180, 0xBFD06116, 0x21B4F4B5, 0x56B3C423, 0xCFBA9599, 0xB8BDA50F, 0x2802B89E, 0x5F058808, 0xC60CD9B2, 0xB10BE924, 0x2F6F7C87, 0x58684C11, 0xC1611DAB, 0xB6662D3D, 0x76DC4190, 0x01DB7106, 0x98D220BC, 0xEFD5102A, 0x71B18589, 0x06B6B51F, 0x9FBFE4A5, 0xE8B8D433, 0x7807C9A2, 0x0F00F934, 0x9609A88E, 0xE10E9818, 0x7F6A0DBB, 0x086D3D2D, 0x91646C97, 0xE6635C01, 0x6B6B51F4, 0x1C6C6162, 0x856530D8, 0xF262004E, 0x6C0695ED, 0x1B01A57B, 0x8208F4C1, 0xF50FC457, 0x65B0D9C6, 0x12B7E950, 0x8BBEB8EA, 0xFCB9887C, 0x62DD1DDF, 0x15DA2D49, 0x8CD37CF3, 0xFBD44C65, 0x4DB26158, 0x3AB551CE, 0xA3BC0074, 0xD4BB30E2, 0x4ADFA541, 0x3DD895D7, 0xA4D1C46D, 0xD3D6F4FB, 0x4369E96A, 0x346ED9FC, 0xAD678846, 0xDA60B8D0, 0x44042D73, 0x33031DE5, 0xAA0A4C5F, 0xDD0D7CC9, 0x5005713C, 0x270241AA, 0xBE0B1010, 0xC90C2086, 0x5768B525, 0x206F85B3, 0xB966D409, 0xCE61E49F, 0x5EDEF90E, 0x29D9C998, 0xB0D09822, 0xC7D7A8B4, 0x59B33D17, 0x2EB40D81, 0xB7BD5C3B, 0xC0BA6CAD, 0xEDB88320, 0x9ABFB3B6, 0x03B6E20C, 0x74B1D29A, 0xEAD54739, 0x9DD277AF, 0x04DB2615, 0x73DC1683, 0xE3630B12, 0x94643B84, 0x0D6D6A3E, 0x7A6A5AA8, 0xE40ECF0B, 0x9309FF9D, 0x0A00AE27, 0x7D079EB1, 0xF00F9344, 0x8708A3D2, 0x1E01F268, 0x6906C2FE, 0xF762575D, 0x806567CB, 0x196C3671, 0x6E6B06E7, 0xFED41B76, 0x89D32BE0, 0x10DA7A5A, 0x67DD4ACC, 0xF9B9DF6F, 0x8EBEEFF9, 0x17B7BE43, 0x60B08ED5, 0xD6D6A3E8, 0xA1D1937E, 0x38D8C2C4, 0x4FDFF252, 0xD1BB67F1, 0xA6BC5767, 0x3FB506DD, 0x48B2364B, 0xD80D2BDA, 0xAF0A1B4C, 0x36034AF6, 0x41047A60, 0xDF60EFC3, 0xA867DF55, 0x316E8EEF, 0x4669BE79, 0xCB61B38C, 0xBC66831A, 0x256FD2A0, 0x5268E236, 0xCC0C7795, 0xBB0B4703, 0x220216B9, 0x5505262F, 0xC5BA3BBE, 0xB2BD0B28, 0x2BB45A92, 0x5CB36A04, 0xC2D7FFA7, 0xB5D0CF31, 0x2CD99E8B, 0x5BDEAE1D, 0x9B64C2B0, 0xEC63F226, 0x756AA39C, 0x026D930A, 0x9C0906A9, 0xEB0E363F, 0x72076785, 0x05005713, 0x95BF4A82, 0xE2B87A14, 0x7BB12BAE, 0x0CB61B38, 0x92D28E9B, 0xE5D5BE0D, 0x7CDCEFB7, 0x0BDBDF21, 0x86D3D2D4, 0xF1D4E242, 0x68DDB3F8, 0x1FDA836E, 0x81BE16CD, 0xF6B9265B, 0x6FB077E1, 0x18B74777, 0x88085AE6, 0xFF0F6A70, 0x66063BCA, 0x11010B5C, 0x8F659EFF, 0xF862AE69, 0x616BFFD3, 0x166CCF45, 0xA00AE278, 0xD70DD2EE, 0x4E048354, 0x3903B3C2, 0xA7672661, 0xD06016F7, 0x4969474D, 0x3E6E77DB, 0xAED16A4A, 0xD9D65ADC, 0x40DF0B66, 0x37D83BF0, 0xA9BCAE53, 0xDEBB9EC5, 0x47B2CF7F, 0x30B5FFE9, 0xBDBDF21C, 0xCABAC28A, 0x53B39330, 0x24B4A3A6, 0xBAD03605, 0xCDD70693, 0x54DE5729, 0x23D967BF, 0xB3667A2E, 0xC4614AB8, 0x5D681B02, 0x2A6F2B94, 0xB40BBE37, 0xC30C8EA1, 0x5A05DF1B, 0x2D02EF8D);


// 'crc' should be initialized to 0xFFFFFFFF and after the computation it should be
// complemented (inverted).
// 
// CRC-32 is also known as FCS-32.
// 
// If the FCS-32 is calculated over the data and over the complemented FCS-32, the
// result will always be 0xDEBB20E3 (without the complementation).
function crc32Add(crc, c)
{
	return CRC32_TAB[(crc ^ c) & 0xFF] ^ ((crc >> 8) & 0xFFFFFF);
};
//
// C/C++ language:
// 
// inline unsigned long crc32Add(unsigned long crc, unsigned char c)
// {
// 	return CRC32_TAB[(unsigned char)crc^c]^(crc>>8);
// }
//

function crc8(str) {
	var n, len = str.length,
		crc = 0;
	for (var i = 0; i < len; i++)
	crc = crc8Add(crc, str.charCodeAt(i));
	return crc;
};

function crc8Buffer(buf) {
	var crc = 0;
	for (var i = 0, len = buf.length; i < len; ++i) {
		crc = crc8Add(crc, buf[i]);
	}
	return crc;
}

function crcArc(str) {
	var i, len = str.length,
		crc = 0;
	for (i = 0; i < len; i++)
	crc = crcArcAdd(crc, str.charCodeAt(i));
	return crc;
};

function crcModbusString(str) {
	//SAME AS ABOVE EXCEPT THIS HAS THE MODBUS CRC AT 0XFFFF
	var i, len = str.length,
		crc = 65535;
	for (i = 0; i < len; i++)
	crc = crcArcAdd(crc, str.charCodeAt(i));
	return crc;
};

function crcModbusHex(buf) {
	//SAME AS ABOVE EXCEPT THIS HAS THE MODBUS CRC AT 0XFFFF
	var crc = 65535
	for (var i = 0, len = buf.length; i < len; ++i) {
		crc = crcArcAdd(crc, buf[i]);
	}
	return crc;
};

function crc16(str) {
	var i, len = str.length,
		crc = 0;
	for (i = 0; i < len; i++)
	crc = crc16Add(crc, str.charCodeAt(i));
	return crc;
};

function crc16Buffer(buf) {
	var crc = 0;
	for (var i = 0, len = buf.length; i < len; ++i) {
		crc = crc16Add(crc, buf[i]);
	}
	return crc;
}

function fcs16(str) {
	var i, len = str.length,
		fcs = 0xFFFF;
	for (i = 0; i < len; i++)
	fcs = fcs16Add(fcs, str.charCodeAt(i));
	return fcs ^ 0xFFFF;
};

function crc32(str) {
	var i, len = str.length,
		crc = 0xFFFFFFFF;
	for (i = 0; i < len; i++)
	crc = crc32Add(crc, str.charCodeAt(i));
	return crc ^ 0xFFFFFFFF;
};

function crc32Buffer(buf) {
	var crc = 0xFFFFFFFF;
	for (var i = 0, len = buf.length; i < len; ++i) {
		crc = crc32Add(crc, buf[i]);
	}
	return crc ^ 0xFFFFFFFF;
}
/**
 * Convert value as 8-bit unsigned integer to 2 digit hexadecimal number.
 */

function hex8(val) {
	var n = val & 0xFF,
		str = n.toString(16).toUpperCase();
	while (str.length < 2)
	str = "0" + str;
	return str;
};
/**
 * Convert value as 16-bit unsigned integer to 4 digit hexadecimal number.
 */

function hex16(val) {
	return hex8(val >> 8) + hex8(val);
};
/**
 * Convert value as 32-bit unsigned integer to 8 digit hexadecimal number.
 */

function hex32(val) {
	return hex16(val >> 16) + hex16(val);
};
var target, property;
if (typeof(window) == 'undefined') {
	target = module;
	property = 'exports';
} else {
	target = window;
	property = 'crc';
}


module.exports = exports = {
	'crc8': crc8,
	'crcArc': crcArc,
	'crcModbusString': crcModbusString,
	'crcModbusHex': crcModbusHex,
	'crc16': crc16,
	'fcs16': fcs16,
	'crc32': crc32,
	'hex8': hex8,
	'hex16': hex16,
	'hex32': hex32,
	'crc8Buffer': crc8Buffer,
	'crc16Buffer': crc16Buffer,
	'crc32Buffer': crc32Buffer,
	
	'crc32Add' : crc32Add
}