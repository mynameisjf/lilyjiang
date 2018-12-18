package com.jiangf.query;

import java.util.List;

/**
 * @author Beau 462620105@qq.com
 * @date 2018-08-30
 * @email 462620105@qq.com
 *
 * 前端列表页查询条件后台封装类
 */
public class QueryCondition {
    private String column;
    private String exp;
    private Object value;
    private String orderType;
    private String orderKey;
    private String direction;
    private List<QueryCondition> orConditionList;

    public QueryCondition() {
    }

    public String getColumn() {
        return this.column;
    }

    public void setColumn(String column) {
        this.column = column;
    }

    public String getExp() {
        return this.exp;
    }

    public void setExp(String exp) {
        this.exp = exp;
    }

    public Object getValue() {
        return this.value;
    }

    public void setValue(Object value) {
        this.value = value;
    }

    public String getOrderType() {
        return this.orderType;
    }

    public void setOrderType(String orderType) {
        this.orderType = orderType;
    }

    public String getOrderKey() {
        return this.orderKey;
    }

    public void setOrderKey(String orderKey) {
        this.orderKey = orderKey;
    }

    public String getDirection() {
        return this.direction;
    }

    public void setDirection(String direction) {
        this.direction = direction;
    }

    public List<QueryCondition> getOrConditionList() {
        return this.orConditionList;
    }

    public void setOrConditionList(List<QueryCondition> orConditionList) {
        this.orConditionList = orConditionList;
    }
}