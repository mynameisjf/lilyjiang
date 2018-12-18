package com.jiangf.util;

import org.springframework.util.StringUtils;

import java.io.UnsupportedEncodingException;

/**
 * 提供了字符串转换的常用方法
 * 如:unicode,全角半角转换
 * @类名称: StringConvert
 * @author Beau 462620105@qq.com
 * @date 2018-08-31
 * @email 462620105@qq.com
 * @备注:字符串转换的常用方法工具类
 */
public abstract class StringConvert {

	/**
	 * 将字符串转成Unicode
	 * Unicode 码对每一个字符用4位16进制数表示。具体规则是：将一个字符(char)的高8位与低8位分别取出，转化为16进制数，如果转化的16进制数的长度不足2位，则在其后补0，然后将高、低8位转成的16进制字符串拼接起来并在前面补上"\\u" 即可。
	 * @param str 待转字符串
	 * @return unicode字符串
	 */
	public static String convertUnicode(String str) {
		str = (str == null ? "" : str);
		String tmp;
		StringBuffer sb = new StringBuffer(1000);
		char c;
		int i, j;
		sb.setLength(0);
		for (i = 0; i < str.length(); i++) {
			c = str.charAt(i);
			sb.append("\\u");
			j = (c >>> 8); //取出高8位
			tmp = Integer.toHexString(j);
			if (tmp.length() == 1) {
				sb.append("0");
			}
			sb.append(tmp);
			j = (c & 0xFF); //取出低8位
			tmp = Integer.toHexString(j);
			if (tmp.length() == 1) {
				sb.append("0");
			}
			sb.append(tmp);
		}
		return sb.toString();
	}

	/**
	 * 将unicode 字符串
	 * @param str 待转字符串
	 * @return 普通字符串
	 */
	public static String revertUnicode(String str) {
		str = (str == null ? "" : str);
		if (str.indexOf("\\u") == -1)//如果不是unicode码则原样返回
			return str;

		StringBuffer sb = new StringBuffer(1000);

		for (int i = 0; i < str.length() - 6; ) {
			String strTemp = str.substring(i, i + 6);
			String value = strTemp.substring(2);
			int c = 0;
			for (int j = 0; j < value.length(); j++) {
				char tempChar = value.charAt(j);
				int t = 0;
				switch (tempChar) {
					case 'a':
						t = 10;
						break;
					case 'b':
						t = 11;
						break;
					case 'c':
						t = 12;
						break;
					case 'd':
						t = 13;
						break;
					case 'e':
						t = 14;
						break;
					case 'f':
						t = 15;
						break;
					default:
						t = tempChar - 48;
						break;
				}

				c += t * ((int) Math.pow(16, (value.length() - j - 1)));
			}
			sb.append((char) c);
			i = i + 6;
		}

		return sb.toString();
	}

	/**
	 * 全角字符串转换半角字符串
	 *
	 * 全角字符与半角字符的关系
	 * 下面的程序看看Java中所有字符以及对应编码的值
	 * <code>
	 *  public static void main(String[] args) {
	 *      for (int i = Character.MIN_VALUE; i <= Character.MAX_VALUE; ++i) {
	 *          System.out.println(i + "    " + (char)i);
	 *      }
	 *  }
	 * </code>
	 *
	 * 从输出可以看到
	 * 1.半角字符是从33开始到126结束
	 * 2.与半角字符对应的全角字符是从65281开始到65374结束
	 * 3.其中半角的空格是32.对应的全角空格是12288
	 * 半角和全角的关系很明显,除空格外的字符偏移量是65248(65281-33 = 65248)
	 *
	 * @title full2Half
	 * @param fullStr 非空的全角字符串
	 * @return 半角字符串
	 * @备注:
	 */
	public static String full2Half(String fullStr) {
		if (StringUtils.hasText(fullStr)) {
			char[] charArray = fullStr.toCharArray();
			for (int i = 0; i < charArray.length; i++) {
				if (charArray[i] >= 65281 && charArray[i] <= 65374) {
					charArray[i] = (char) (charArray[i] - 65248);
				} else if (charArray[i] == 12288) { // 空格
					charArray[i] = (char) 32;
				}
			}
			return new String(charArray);
		}
		return fullStr;
	}

	/**
	 * 半角转全角
	 * @param halfStr
	 * @return
	 */
	public static String half2Full(String halfStr) {
		if (StringUtils.hasText(halfStr)) {
			char[] charArray = halfStr.toCharArray();
			for (int i = 0; i < charArray.length; i++) {
				if (charArray[i] == 32) {
					charArray[i] = (char) 12288;
				} else if (charArray[i] < 127) {
					charArray[i] = (char) (charArray[i] + 65248);
				}
			}
			return new String(charArray);
		}

		return halfStr;
	}

	public static String encodeQuote(String s) {
		return StringUtils.replace(s, "'", "&quote");
	}

	/**
	 * 根据输入的源串(中文或中西文混合)返回其拼音首字母,以小写返回,如果首字符非拼音字母,则统一返回*号
	 *
	 * 例:
	 * ChangShaYinHang -> c
	 * @param str 源串(中文或中西文混合)
	 * @return 返回str的拼音首字母, 以小写返回, 如果首字符非拼音字母, 则统一返回*号
	 */
	public static String getFirstPinYinCharOfString(String str) {
		String firstChar = "*";

		if (str == null || str.length() <= 0) {
			return firstChar;
		}

		try {
			byte firstCharBytes[] = new byte[2];
			int gbcode;

			firstCharBytes[0] = str.getBytes("gb2312")[0];
			gbcode = firstCharBytes[0] & 0x000000ff;
			if (str.length() > 1 || gbcode >= 0xb0) {
				firstCharBytes[1] = str.getBytes("gb2312")[1];
				gbcode = (firstCharBytes[0] & 0x000000ff) * 0x100 + (firstCharBytes[1] & 0x000000ff);
			}

			if (gbcode >= 0xb0a1 && gbcode <= 0xb0c4) {
				firstChar = "a";
			} else if (gbcode >= 0xb0c5 && gbcode <= 0xb2c0) {
				firstChar = "b";
			} else if (gbcode >= 0xb2c1 && gbcode <= 0xb4ed) {
				firstChar = "c";
			} else if (gbcode >= 0xb4ee && gbcode <= 0xb6e9) {
				firstChar = "d";
			} else if (gbcode >= 0xb6ea && gbcode <= 0xb7a1) {
				firstChar = "e";
			} else if (gbcode >= 0xb7a2 && gbcode <= 0xb8c0) {
				firstChar = "f";
			} else if (gbcode >= 0xb8c1 && gbcode <= 0xb9fd) {
				firstChar = "g";
			} else if (gbcode >= 0xb9fe && gbcode <= 0xbbf6) {
				firstChar = "h";
			} else if (gbcode >= 0xbbf7 && gbcode <= 0xbfa5) {
				firstChar = "j";
			} else if (gbcode >= 0xbfa6 && gbcode <= 0xc0ab) {
				firstChar = "k";
			} else if (gbcode >= 0xc0ac && gbcode <= 0xc2e7) {
				firstChar = "l";
			} else if (gbcode >= 0xc2e8 && gbcode <= 0xc4c2) {
				firstChar = "m";
			} else if (gbcode >= 0xc4c3 && gbcode <= 0xc5b5) {
				firstChar = "n";
			} else if (gbcode >= 0xc5b6 && gbcode <= 0xc5bd) {
				firstChar = "o";
			} else if (gbcode >= 0xc5be && gbcode <= 0xc6d9) {
				firstChar = "p";
			} else if (gbcode >= 0xc6da && gbcode <= 0xc8ba) {
				firstChar = "q";
			} else if (gbcode >= 0xc8bb && gbcode <= 0xc8f5) {
				firstChar = "r";
			} else if (gbcode >= 0xc8f6 && gbcode <= 0xcbf9) {
				firstChar = "s";
			} else if (gbcode >= 0xcbfa && gbcode <= 0xcdd9) {
				firstChar = "t";
			} else if (gbcode >= 0xcdda && gbcode <= 0xcef3) {
				firstChar = "w";
			} else if (gbcode >= 0xcef4 && gbcode <= 0xd1b8) {
				firstChar = "x";
			} else if (gbcode >= 0xd1b9 && gbcode <= 0xd4d0) {
				firstChar = "y";
			} else if (gbcode >= 0xd4d1 && gbcode <= 0xd7f9) {
				firstChar = "z";
			} else {
				gbcode = firstCharBytes[0];
			}

			if (gbcode >= 'A' && gbcode <= 'Z') {
				gbcode += 32;
			}
			if (gbcode >= 'a' && gbcode <= 'z') {
				firstChar = String.valueOf((char) gbcode);
			}
		} catch (Exception e) {
			System.out.println("getFirstPinYinCharOfString Exception: " + e.getMessage());
			e.printStackTrace();
		}

		return firstChar;
	}

	public static void main(String[] args) throws UnsupportedEncodingException {
		String str = "Beau";

		System.out.println("01:" + new String(str.getBytes("GBK"), "ISO8859_1"));
		System.out.println("02:" + new String(str.getBytes("GBK"), "utf-8"));
		System.out.println("03:" + new String(str.getBytes("GBK"), "GB2312"));
		System.out.println("04:" + new String(str.getBytes("GBK"), "GBK"));
		System.out.println("05:" + new String(str.getBytes("ISO8859_1"), "GBK"));
		System.out.println("06:" + new String(str.getBytes("ISO8859_1"), "ISO8859_1"));
		System.out.println("07:" + new String(str.getBytes("ISO8859_1"), "GB2312"));
		System.out.println("08:" + new String(str.getBytes("ISO8859_1"), "utf-8"));
		System.out.println("09:" + new String(str.getBytes("utf-8"), "GBK"));
		System.out.println("10:" + new String(str.getBytes("utf-8"), "utf-8"));
		System.out.println("11:" + new String(str.getBytes("utf-8"), "GB2312"));
		System.out.println("12:" + new String(str.getBytes("utf-8"), "ISO8859_1"));
		System.out.println("13:" + new String(str.getBytes("GB2312"), "GB2312"));
		System.out.println("14:" + new String(str.getBytes("GB2312"), "ISO8859_1"));
		System.out.println("15:" + new String(str.getBytes("GB2312"), "utf-8"));
		System.out.println("16:" + new String(str.getBytes("GB2312"), "GBK"));
		
	}
}
