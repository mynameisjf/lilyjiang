package com.jiangf.util;

import org.apache.commons.lang3.StringUtils;

import java.lang.reflect.InvocationTargetException;
import java.util.List;

/**
 * Created by JIANGF on 2018/12/19.
 */
public class TransUtil {

	private DictionaryUtil dictionaryUtil;
	/**
	 * 单态实例
	 */
	private static TransUtil transUtil;

	/**
	 * 获得单态实例
	 * 
	 * @return 单态实例
	 */
	public static TransUtil getInstance() {
		if (transUtil == null) {
			transUtil = new TransUtil();
		}
		return transUtil;
	}

	/**
	 * 私有构造器
	 */
	private TransUtil() {
	}
	
	/**
	 * 导出excel字段需要转换的方法
	 * @param transition
	 * @param list
	 * @return
	 * @throws ClassNotFoundException
	 * @throws InstantiationException
	 * @throws IllegalAccessException
	 * @throws IllegalArgumentException
	 * @throws SecurityException
	 * @throws InvocationTargetException
	 * @throws NoSuchMethodException
	 */
	public List<Object> transField(String transition, List<Object> list)
			throws ClassNotFoundException, InstantiationException,
			IllegalAccessException, IllegalArgumentException,
			SecurityException, InvocationTargetException, NoSuchMethodException {
		if (!StringUtils.isBlank(transition) && list != null && list.size() > 0) {
			// transition的格式:status|dictionary|order_status,amount|money|100
			String[] strs = StringUtils.split(transition, ",");
				for (String str : strs) {
				// args的格式:status|dictionary|order_status,拆分后中间的字符串首字母大写后加上"util"可以得到类名
				// 第一个字符串首字母大写后前面加上trans可以得到调用的方法名,最后一个字符串是转换的参数
				String[] args = StringUtils.split(str, "|");
				Class clzz = Class.forName("com.jiangf.util." + args[1]+ "Util");
				Object obj = "dictionary".equalsIgnoreCase(args[1]) ? dictionaryUtil: clzz.newInstance();
				list = (List<Object>) clzz.getMethod("transType", List.class,String.class, String.class)
						.invoke(obj, list, args[0], args[2]);
			}
		}
		return list;
	}

}
