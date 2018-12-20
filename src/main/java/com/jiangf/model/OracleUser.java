package com.jiangf.model;

import com.baomidou.mybatisplus.annotation.*;

import java.util.Date;

/**
 * Created by JIANGF on 2018/12/20.
 */
@TableName("T_FW_ORM_USER")
public class OracleUser {

    @TableId
    private String userId;

    private String userAcct;

    private String userAcctCn;

    private String operatorId;

    /**
     * 创建时间
     */
    @TableField(fill= FieldFill.INSERT)
    protected Date createTime;
    /**
     * 修改时间
     */
    @TableField(fill= FieldFill.INSERT_UPDATE)
    protected Date modifyTime;

    /**
     * 逻辑删除字段：0：未被逻辑删除，1;已被逻辑删除
     */
    @TableLogic
    @TableField(fill= FieldFill.INSERT)
    protected Integer validSign;

    private String resActMapId;

    public String getResActMapId() {
        return resActMapId;
    }

    public void setResActMapId(String resActMapId) {
        this.resActMapId = resActMapId;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getUserAcct() {
        return userAcct;
    }

    public void setUserAcct(String userAcct) {
        this.userAcct = userAcct;
    }

    public String getUserAcctCn() {
        return userAcctCn;
    }

    public void setUserAcctCn(String userAcctCn) {
        this.userAcctCn = userAcctCn;
    }

    public String getOperatorId() {
        return operatorId;
    }

    public void setOperatorId(String operatorId) {
        this.operatorId = operatorId;
    }

    public Date getModifyTime() {
        return modifyTime;
    }

    public void setModifyTime(Date modifyTime) {
        this.modifyTime = modifyTime;
    }

    public Integer getValidSign() {
        return validSign;
    }

    public void setValidSign(Integer validSign) {
        this.validSign = validSign;
    }

    public Date getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Date createTime) {
        this.createTime = createTime;
    }
}
