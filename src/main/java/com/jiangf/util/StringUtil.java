package com.jiangf.util;


import org.springframework.util.StringUtils;

import java.util.*;

/**
 * @author Beau
 * @date 2018-08-31
 * @email 462620105@qq.com
 * @备注:字符串工具方法类
 */
public abstract class StringUtil extends StringUtils {

    /**
     * 把字符串解析成map 如 parseStringToMap("key1:value1;key2:value2",";",":")
     * @方法名: parseStringToMap
     * @param str ：要解析的字符串
     * @param splitstr1 整体上的切分字符串
     * @param splitstr2 整体切分后局部的切分字符串
     * @return Map<String,Object>
     */
    public static Map<String, String> parseStringToMap(String str, String splitstr1, String splitstr2) {
        if (null == str || "".equals(str)) {
            return null;
        }
        Map<String, String> map = new HashMap<String, String>();
        String[] expends = str.split(splitstr1);
        for (int i = 0; i < expends.length; i++) {
            String[] temp = expends[i].split(splitstr2);
            if (temp.length == 2) {
                String key = temp[0];
                String value = temp[1];
                map.put(key, value);
            }
        }
        return map;
    }

    /**
     * 解析指定的字符串 str与分隔符 splitstr1 成 list 集合
     * @title parseStringToList
     * @param str
     * @param splitstr1
     * @return
     */
    public static List<String> parseStringToList(String str, String splitstr1) {
        ArrayList<String> arr = new ArrayList<String>();
        if (null != str) {
            if (str.indexOf(splitstr1) == -1) {
                arr.add(str);
            } else {
                String[] s = str.split(splitstr1);
                for (int i = 0; i < s.length; i++) {
                    if (StringUtils.hasText(s[i])) {
                        arr.add(s[i]);
                    }
                }
            }
        }

        return arr;
    }

    /**
     * 给指定的 sql 左右两边添加百分号,方便模糊查询
     * @title like
     * @param sql 需求所加原始字符串
     */
    public static String like(String sql) {
        if (!hasText(sql)) {
            if (sql.indexOf(Symbol.PERCENT.getSymbol()) < 0) {
                return Symbol.PERCENT.getSymbol() + sql + Symbol.PERCENT.getSymbol();
            } else {
                return sql;
            }
        }

        return null;
    }

    public static Object likeIfString(Object obj) {
        return (obj instanceof String ? like((String) obj) : obj);
    }

    /**
     * 去除字符串中所包含的空格（包括:空格(全角，半角)、制表符、换页符等)
     * @param s
     * @return
     */
    public static String trimAllBlank(String s) {
        String result = "";
        if (null != s && !"".equals(s)) {
            result = s.replaceAll("[　*| *| *|//s*]*", "");
        }
        return result;
    }

    /**
     * 去除字符串中头部和尾部所包含的空格（包括:空格(全角，半角)、制表符、换页符等）
     *
     * jdk,spring-StringUtil,beau-commons-StringUtil 区别如下
     * <code>
     *  String str="　a　rg　";
     *  System.out.println("trim=>>"+str.trim());
     *  System.out.println("trimWhitespace=>>"+StringUtils.trimWhitespace(str));
     *  System.out.println("trimLeadingWhitespace=>>"+StringUtils.trimLeadingWhitespace(str));
     *  System.out.println("trimTrailingWhitespace=>>"+StringUtils.trimTrailingWhitespace(str));
     *  System.out.println("StringUtils.removeBlank=>>"+StringUtils.removeBlank(str));
     *  System.out.println("StringUtils.removeAllBlank=>>"+StringUtils.removeAllBlank(str));
     * </code>
     * print:
     * <code>
     *  trim=>>　a　rg　
     *  trimWhitespace=>>a　rg
     *  trimLeadingWhitespace=>>a　rg　
     *  trimTrailingWhitespace=>>　a　rg
     *  StringUtils.trim=>>a　rg
     *  StringUtils.removeAllBlank=>>arg
     * </code>
     *
     * @param s
     * @return
     */
    public static String trimBlank(String s) {
        String result = "";
        if (null != s && !"".equals(s)) {
            result = s.replaceAll("^[　*| *| *|//s*]*", "").replaceAll("[　*| *| *|//s*]*$", "");
        }
        return result;
    }

    /**
     * 去除指定字符串 str 结尾的指定字符 endsWithWord
     *
     * jdk,spring-StringUtil,beau-commons-StringUtil 区别如下
     * <code>
     *  System.out.println("removeEndsWith=>>" + StringUtils.removeEndsWith(str1, "b"));
     *  System.out.println("trimLeadingCharacter=>>" + StringUtils.trimLeadingCharacter(str1, 'b'));
     *  System.out.println("trimTrailingCharacter=>>" + StringUtils.trimTrailingCharacter(str1, 'b'));
     * </code>
     * print:
     * <code>
     *  removeEndsWith=>>bb123b
     *  trimLeadingCharacter=>>123bb
     *  trimTrailingCharacter=>>bb123
     * </code>
     *
     * @param  str
     * @param  endsWithWord
     * @return
     */
    public static String trimEndsWith(String str, String endsWithWord) {
        if (null == str || null == endsWithWord || !str.endsWith(endsWithWord)) {
            return str;
        } else {
            return str.substring(0, str.length() - endsWithWord.length());
        }
    }

    /**
     * @方法名: intToFullBinaryString
     * @描述: 打印整型数值的完整二进制格式
     * @param arg
     * @return
     * @返回类型 String
     * @throws
     */
    public static String intToFullBinaryString(int arg) {
        StringBuffer s = new StringBuffer(Integer.SIZE);
        for (int i = (Integer.SIZE - 1); i >= 0; i--) {
            s.append(arg >> i & 1);
        }
        return s.toString();
    }

    /**
     * 在指定字符串 arg0 尾部追加指定个数 arg1 的全角空格.
     *
     * 注意:该方法追加的是半角,如果要追加半角空格使用使用如下代码
     * <code>
     *     //在 aaa 尾部增加10个空格
     *     String.format("%1$-13s", "aaa");
     * </code>
     *
     * @title addRightFullSpacing
     * @param arg0 需要追加的字符串
     * @param arg1 需要追加多少个
     *
     * @return 返回追加成功的字符串
     * @备注:
     */
    public static String addRightFullSpacing(String arg0, int arg1) {
        if (StringUtils.hasText(arg0)) {
            StringBuffer sb = new StringBuffer(arg0);
            for (int i = 0; i < arg1; i++) {
                sb.append((char) 12288);
            }

            return sb.toString();
        }

        return arg0;
    }



    /**
     * 将驼峰式命名的字符串转换为下划线大写方式。如果转换前的驼峰式命名的字符串为空，则返回空字符串。</br>
     * 例如：helloWorld->HELLO_WORLD
     * @param field 转换前的驼峰式命名的字符串(例如java实体属性字段)
     * @return 转换后下划线大写方式命名的字符串
     */
    public static String field2column(String field) {
        StringBuilder result = new StringBuilder();
        if (field != null && field.length() > 0) {
            // 将第一个字符处理成大写
            result.append(field.substring(0, 1).toUpperCase());
            // 循环处理其余字符
            for (int i = 1; i < field.length(); i++) {
                String s = field.substring(i, i + 1);
                // 在大写字母前添加下划线
                if (s.equals(s.toUpperCase()) && !Character.isDigit(s.charAt(0))) {
                    result.append("_");
                }
                // 其他字符直接转成大写
                result.append(s.toUpperCase());
            }
        }
        return result.toString();
    }

    /**
     * 将下划线大写方式命名的字符串转换为驼峰式。如果转换前的下划线大写方式命名的字符串为空，则返回空字符串。</br>
     * 例如：HELLO_WORLD->helloWorld
     * @param column 转换前的下划线大写方式命名的字符串(例如数据库字段)
     * @return 转换后的驼峰式命名的字符串
     */
    public static String column2field(String column) {
        StringBuilder result = new StringBuilder();
        // 快速检查
        if (column == null || column.isEmpty()) {
            // 没必要转换
            return "";
        } else if (!column.contains("_")) {
            // 不含下划线，仅将首字母小写
            return column.substring(0, 1).toLowerCase() + column.substring(1).toLowerCase();
        }
        // 用下划线将原始字符串分割
        String camels[] = column.split("_");
        for (String camel :  camels) {
            // 跳过原始字符串中开头、结尾的下换线或双重下划线
            if (camel.isEmpty()) {
                continue;
            }
            // 处理真正的驼峰片段
            if (result.length() == 0) {
                // 第一个驼峰片段，全部字母都小写
                result.append(camel.toLowerCase());
            } else {
                // 其他的驼峰片段，首字母大写
                result.append(camel.substring(0, 1).toUpperCase());
                result.append(camel.substring(1).toLowerCase());
            }
        }
        return result.toString();
    }




    public static void main(String[] args) {
        String str = "　a　rg　";
        System.out.println("trim=>>" + str.trim());
        System.out.println("trimWhitespace=>>" + StringUtil.trimWhitespace(str));
        System.out.println("trimLeadingWhitespace=>>" + StringUtil.trimLeadingWhitespace(str));
        System.out.println("trimTrailingWhitespace=>>" + StringUtil.trimTrailingWhitespace(str));
        System.out.println("StringUtils.removeBlank=>>" + StringUtil.trimBlank(str));
        System.out.println("StringUtils.removeAllBlank=>>" + StringUtil.trimAllBlank(str));

        String str1 = "bb123bb";

        System.out.println("trimEndsWith=>>" + StringUtil.trimEndsWith(str1, "b"));
        System.out.println("trimLeadingCharacter=>>" + StringUtil.trimLeadingCharacter(str1, 'b'));
        System.out.println("trimTrailingCharacter=>>" + StringUtil.trimTrailingCharacter(str1, 'b'));

        System.out.println(column2field("AGE"));
    }
}
