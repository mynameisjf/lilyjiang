package com.jiangf.query;





import com.alibaba.fastjson.JSON;
import com.baomidou.mybatisplus.core.conditions.Wrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.jiangf.constant.Constant;
import com.jiangf.util.StringUtil;
import org.apache.commons.lang3.StringUtils;

import java.util.*;


/**
 * @author Beau 462620105@qq.com
 * @date 2018-08-30
 * @email 462620105@qq.com
 * @类描述： 查询条件处理助手类
 */
public class QueryConditionHandle {




	public static void parsecQueryParameterMapArray(Map<String, String[]> paramMapArray, Wrapper wrapper) {
		Map<String, String> parameterMap = new HashMap();
		parameterMap.put(Constant.PARAM_CONDITION, null != paramMapArray.get(Constant.PARAM_CONDITION) ? ((String[])paramMapArray.get(Constant.PARAM_CONDITION))[0] : null);
		//查询条件 集合
		List<QueryCondition> conditionList = new ArrayList();
		//获取条件里面的页码和每页显示多少条数据

		//获取查询条件
		if (StringUtils.isNotBlank((CharSequence) parameterMap.get(Constant.PARAM_CONDITION))) {
			conditionList = JSON.parseArray((String) parameterMap.get(Constant.PARAM_CONDITION), QueryCondition.class);
		}
		//处理查询条件里面的参数
		Iterator iterator = ((List)conditionList).iterator();
		while(iterator.hasNext()) {
			QueryCondition condition = (QueryCondition)iterator.next();
			if (null != condition.getOrConditionList() && condition.getOrConditionList().size() != 0) {
				//处理or条件
				List<QueryCondition> orConditionList = condition.getOrConditionList();
				int size = orConditionList.size();
//				wrapper.and();
				for(int i=0;i<size;i++){
					QueryCondition orCondition = orConditionList.get(i);
					//增加 or 条件到wrapper 里面去
					parsecConditionToWrapper(orCondition,wrapper);
//					if(i<size-1){wrapper.or();}
				}
			} else {
				//处理and条件
				parsecConditionToWrapper(condition,wrapper);
			}
		}
	}

	/**
	 * 前端表格查询参数解析方法
	 * @param paramMapArray
	 * @param wrapper
	 * @param page
	 */
	public static void parsecQueryParameterMapArray(Map<String, String[]> paramMapArray, Wrapper wrapper, Page page) {

		Map<String, String> parameterMap = new HashMap();
		parameterMap.put(Constant.PARAM_PAGE, null != paramMapArray.get(Constant.PARAM_PAGE) ? ((String[])paramMapArray.get(Constant.PARAM_PAGE))[0] : null);
		parameterMap.put(Constant.PARAM_ROWS, null != paramMapArray.get(Constant.PARAM_ROWS) ? ((String[])paramMapArray.get(Constant.PARAM_ROWS))[0] : null);
		parameterMap.put(Constant.PARAM_CONDITION, null != paramMapArray.get(Constant.PARAM_CONDITION) ? ((String[])paramMapArray.get(Constant.PARAM_CONDITION))[0] : null);
		//默认查询第一页
		Integer pageNo = 1;
		//默认每页显示10条数据
		Integer pageSize = 10;
		//升序排序字段 集合
		List<String> asc=new ArrayList<>();
		//降序排序字段 集合
		List<String> desc=new ArrayList<>();
		//查询条件 集合
		List<QueryCondition> conditionList = new ArrayList();
		//获取条件里面的页码和每页显示多少条数据
		if (StringUtils.isNotBlank((CharSequence)parameterMap.get(Constant.PARAM_PAGE))) {
			pageNo = Integer.valueOf((String)parameterMap.get(Constant.PARAM_PAGE)).intValue();
		}
		if (StringUtils.isNotBlank((CharSequence)parameterMap.get(Constant.PARAM_ROWS))) {
			pageSize = Integer.valueOf((String)parameterMap.get(Constant.PARAM_ROWS)).intValue();
		}
		//设置查询的时第几页和每页显示多少条数据
		page.setCurrent(pageNo);
		page.setSize(pageSize);
		//获取查询条件
		if (StringUtils.isNotBlank((CharSequence)parameterMap.get(Constant.PARAM_CONDITION))) {
			conditionList = JSON.parseArray((String)parameterMap.get(Constant.PARAM_CONDITION), QueryCondition.class);
		}
		//处理查询条件里面的参数
		Iterator iterator = ((List)conditionList).iterator();
		while(iterator.hasNext()) {
			QueryCondition condition = (QueryCondition)iterator.next();
			if (null != condition.getOrConditionList() && condition.getOrConditionList().size() != 0) {
				//处理or条件
				List<QueryCondition> orConditionList = condition.getOrConditionList();
				int size = orConditionList.size();
//				wrapper.and();
				for(int i=0;i<size;i++){
					QueryCondition orCondition = orConditionList.get(i);
					//增加 or 条件到wrapper 里面去
					parsecConditionToWrapper(orCondition,wrapper);
//					if(i<size-1){wrapper.or();}
				}
			} else {
				//处理and条件
				parsecConditionToWrapper(condition,wrapper);
			}
			//处理排序
			String orderType = condition.getOrderType();
			if (StringUtil.hasText(orderType)) {//排序条件
				String column = condition.getColumn();
				String direction = condition.getDirection();
				if (Constant.ORDER_DEFAULT.equals(orderType)) {//默认排序（升序或降序）
					if(Constant.ASC.equals(direction)){
						asc.add(column);
					}
					if(Constant.DESC.equals(direction)){
						desc.add(column);
					}
				} else if(Constant.ORDER_CUSTOM.equals(orderType)) {//自定义排序
					String orderKey = condition.getOrderKey();
					//todo...

				}
			}
		}
		//将查询条件里面的排序字段设置到page上
		page.setAscs(asc);
		page.setDescs(desc);
	}

	public static Wrapper parsecConditionToWrapper(QueryCondition condition, Wrapper wrapper) {
		String exp = condition.getExp();//条件表达式
		String column = condition.getColumn();//属性名对应的列名
		Object value = condition.getValue();//属性值
		if (StringUtil.hasText(exp)) {
			byte var3 = -1;
			switch(exp.hashCode()) {
				case -1569359917:
					if (Constant.EXP_RIGHT_LIKE.equals(exp)) {//"rightLike"
						var3 = 7;
					}
					break;
				case -1180261935:
					if (Constant.EXP_IS_NULL.equals(exp)) {//"isNull"
						var3 = 11;
					}
					break;
				case 60:
					if (Constant.EXP_LT.equals(exp)) {//"<"
						var3 = 5;
					}
					break;
				case 61:
					if (Constant.EXP_EQ.equals(exp)) {//"="
						var3 = 0;
					}
					break;
				case 62:
					if (Constant.EXP_GT.equals(exp)) {//">"
						var3 = 3;
					}
					break;
				case 1921:
					if (Constant.EXP_LE.equals(exp)) {//"<="
						var3 = 4;
					}
					break;
				case 1922:
					if (Constant.EXP_NOT_EQ.equals(exp)) {//"<>"
						var3 = 1;
					}
					break;
				case 1983:
					if (Constant.EXP_GE.equals(exp)) {//">="
						var3 = 2;
					}
					break;
				case 3365:
					if (Constant.EXP_IN.equals(exp)) {//"in"
						var3 = 9;
					}
					break;
				case 3321751:
					if (Constant.EXP_LIKE.equals(exp)) {//"like"
						var3 = 6;
					}
					break;
				case 105007960:
					if (Constant.EXP_NOT_IN.equals(exp)) {//"notIn"
						var3 = 10;
					}
					break;
				case 1548782192:
					if (Constant.EXP_IS_NOT_NULL.equals(exp)) {//"isNotNull"
						var3 = 12;
					}
					break;
				case 1718183998:
					if (Constant.EXP_LEFT_LIKE.equals(exp)) {//"leftLike"
						var3 = 8;
					}
			}
			switch(var3) {
//				case 0://=
//					wrapper.eq(column,value);
//					break;
//				case 1://!=
//					wrapper.ne(column,value);
//					break;
//				case 2://>=
//					wrapper.ge(column,value);
//					break;
//				case 3://>
//					wrapper.gt(column,value);
//					break;
//				case 4://<=
//					wrapper.le(column,value);
//					break;
//				case 5://<
//					wrapper.lt(column,value);
//					break;
//				case 6://like
//					wrapper.like(column,value.toString());
//					break;
//				case 7://rightLike
//					wrapper.like(column,value.toString());
//					break;
//				case 8://leftLike
//					wrapper.like(column,value.toString());
//					break;
//				case 9://in
//					//todo
//					wrapper.in(column,(String)value);
//					break;
//				case 10://notin
//					//todo
//					wrapper.notIn(column,value);
//					break;
//				case 11://isNull
//					wrapper.isNull(column);
//					break;
//				case 12:
//					wrapper.isNotNull(column);
			}
		}
		return wrapper;
	}

	
}
