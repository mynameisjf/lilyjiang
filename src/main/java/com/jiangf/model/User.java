package com.jiangf.model;


import com.baomidou.mybatisplus.annotation.*;
import com.fasterxml.jackson.annotation.JsonFormat;

import java.util.Date;
import java.util.UUID;

/**
 * <p>
 * 用户表,用户ID：1=超级用户
 * </p>
 *
 * @author Beau 462620105@qq.com
 * @since 2018-09-11
 */
@TableName("T_FW_USER")
public class User  {

    @TableId(value = "ID", type = IdType.INPUT)
    protected String id = UUID.randomUUID().toString().replaceAll("-", "");
    /**
     * 用户LOGIN账号
     */
    private String userAcct;
    /**
     * 用户LOGIN账号中文，冗余字段
     */
    private String userAcctCn;
    /**
     * 用户登录密码，使用MD5码加密
     */
    private String userPwd;

    /**
     * 用户登录确认密码
     */
    @TableField(exist = false)
    private String userPwdRepeat;
    /**
     * 用户账号说明描述
     */
    private String userAcctDesc;
    /**
     * 用户账号类型代码:：PERSON=普通用户账号、SYSTEM=系统用户账号、TEST=管理员用户账号
     */
    private String userAcctTypeCode;
    /**
     * 用户账号类型值
     */
    private String userAcctTypeValue;
    /**
     * 排序字段
     */
    private String userSerial;
    /**
     * 微信 OpenID
     */
    private String wechatOpenid;
    /**
     * 用户所属岗位，岗位ID并列存储
     */
    private String userPId;
    /**
     * 用户所属部门，部门ID并列存储
     */
    private String userDId;
    /**
     * 用户所属机构，机构ID并列存储
     */
    private String userOId;
    /**
     * 用户所属角色，角色ID并列存储
     */
    private String userRId;


    /**
     * 用户名字
     */
    private String userName;
    /**
     * 性别代码
     */
    private String userSexCode;
    /**
     * 性别值
     */
    private String userSexValue;
    /**
     * 学历代码
     */
    private String userGradeCode;
    /**
     * 学历值
     */
    private String userGradeValue;
    /**
     * 生日
     */
    @JsonFormat(pattern="YYYY-MM-dd",timezone = "GMT+8")
    private Date userBirth;
    /**
     * 政治面貌代码
     */
    private String politicalFaceCode;
    /**
     * 政治面貌值
     */
    private String politicalFaceValue;
    /**
     * 籍贯代码
     */
    private String nativePlaceCode;
    /**
     * 籍贯值
     */
    private String nativePlaceValue;
    /**
     * 邮件地址
     */
    private String connEmail1;
    /**
     * 联系电话
     */
    private String connPhone1;
    /**
     * 联系地址
     */
    private String connAdd1;
    /**
     * 邮件地址
     */
    private String connEmail2;
    /**
     * 联系电话
     */
    private String connPhone2;
    /**
     * 联系地址
     */
    private String connAdd2;
    /**
     * QQ号
     */
    private String connQq;
    /**
     * MSN号
     */
    private String connMsn;

    /**
     * 创建人
     */
    @TableField(fill= FieldFill.INSERT)
    protected String createUser;
    /**
     * 创建时间
     */
    @TableField(fill= FieldFill.INSERT)
    protected String createTime;
    /**
     * 修改人
     */
    @TableField(fill= FieldFill.INSERT_UPDATE)
    protected String modifyUser;
    /**
     * 修改时间
     */
    @TableField(fill= FieldFill.INSERT_UPDATE)
    protected String modifyTime;

    /**
     * 逻辑删除字段：0：未被逻辑删除，1;已被逻辑删除
     */
    @TableLogic
    @TableField(fill= FieldFill.INSERT)
    protected Integer validSign;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
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

    public String getUserPwd() {
        return userPwd;
    }

    public void setUserPwd(String userPwd) {
        this.userPwd = userPwd;
    }

    public String getUserPwdRepeat() {
        return userPwdRepeat;
    }

    public void setUserPwdRepeat(String userPwdRepeat) {
        this.userPwdRepeat = userPwdRepeat;
    }

    public String getUserAcctDesc() {
        return userAcctDesc;
    }

    public void setUserAcctDesc(String userAcctDesc) {
        this.userAcctDesc = userAcctDesc;
    }

    public String getUserAcctTypeCode() {
        return userAcctTypeCode;
    }

    public void setUserAcctTypeCode(String userAcctTypeCode) {
        this.userAcctTypeCode = userAcctTypeCode;
    }

    public String getUserAcctTypeValue() {
        return userAcctTypeValue;
    }

    public void setUserAcctTypeValue(String userAcctTypeValue) {
        this.userAcctTypeValue = userAcctTypeValue;
    }

    public String getUserSerial() {
        return userSerial;
    }

    public void setUserSerial(String userSerial) {
        this.userSerial = userSerial;
    }

    public String getWechatOpenid() {
        return wechatOpenid;
    }

    public void setWechatOpenid(String wechatOpenid) {
        this.wechatOpenid = wechatOpenid;
    }

    public String getUserPId() {
        return userPId;
    }

    public void setUserPId(String userPId) {
        this.userPId = userPId;
    }

    public String getUserDId() {
        return userDId;
    }

    public void setUserDId(String userDId) {
        this.userDId = userDId;
    }

    public String getUserOId() {
        return userOId;
    }

    public void setUserOId(String userOId) {
        this.userOId = userOId;
    }

    public String getUserRId() {
        return userRId;
    }

    public void setUserRId(String userRId) {
        this.userRId = userRId;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getUserSexCode() {
        return userSexCode;
    }

    public void setUserSexCode(String userSexCode) {
        this.userSexCode = userSexCode;
    }

    public String getUserSexValue() {
        return userSexValue;
    }

    public void setUserSexValue(String userSexValue) {
        this.userSexValue = userSexValue;
    }

    public String getUserGradeCode() {
        return userGradeCode;
    }

    public void setUserGradeCode(String userGradeCode) {
        this.userGradeCode = userGradeCode;
    }

    public String getUserGradeValue() {
        return userGradeValue;
    }

    public void setUserGradeValue(String userGradeValue) {
        this.userGradeValue = userGradeValue;
    }

    public Date getUserBirth() {
        return userBirth;
    }

    public void setUserBirth(Date userBirth) {
        this.userBirth = userBirth;
    }

    public String getPoliticalFaceCode() {
        return politicalFaceCode;
    }

    public void setPoliticalFaceCode(String politicalFaceCode) {
        this.politicalFaceCode = politicalFaceCode;
    }

    public String getPoliticalFaceValue() {
        return politicalFaceValue;
    }

    public void setPoliticalFaceValue(String politicalFaceValue) {
        this.politicalFaceValue = politicalFaceValue;
    }

    public String getNativePlaceCode() {
        return nativePlaceCode;
    }

    public void setNativePlaceCode(String nativePlaceCode) {
        this.nativePlaceCode = nativePlaceCode;
    }

    public String getNativePlaceValue() {
        return nativePlaceValue;
    }

    public void setNativePlaceValue(String nativePlaceValue) {
        this.nativePlaceValue = nativePlaceValue;
    }

    public String getConnEmail1() {
        return connEmail1;
    }

    public void setConnEmail1(String connEmail1) {
        this.connEmail1 = connEmail1;
    }

    public String getConnPhone1() {
        return connPhone1;
    }

    public void setConnPhone1(String connPhone1) {
        this.connPhone1 = connPhone1;
    }

    public String getConnAdd1() {
        return connAdd1;
    }

    public void setConnAdd1(String connAdd1) {
        this.connAdd1 = connAdd1;
    }

    public String getConnEmail2() {
        return connEmail2;
    }

    public void setConnEmail2(String connEmail2) {
        this.connEmail2 = connEmail2;
    }

    public String getConnPhone2() {
        return connPhone2;
    }

    public void setConnPhone2(String connPhone2) {
        this.connPhone2 = connPhone2;
    }

    public String getConnAdd2() {
        return connAdd2;
    }

    public void setConnAdd2(String connAdd2) {
        this.connAdd2 = connAdd2;
    }

    public String getConnQq() {
        return connQq;
    }

    public void setConnQq(String connQq) {
        this.connQq = connQq;
    }

    public String getConnMsn() {
        return connMsn;
    }

    public void setConnMsn(String connMsn) {
        this.connMsn = connMsn;
    }

    public String getCreateUser() {
        return createUser;
    }

    public void setCreateUser(String createUser) {
        this.createUser = createUser;
    }

    public String getCreateTime() {
        return createTime;
    }

    public void setCreateTime(String createTime) {
        this.createTime = createTime;
    }

    public String getModifyUser() {
        return modifyUser;
    }

    public void setModifyUser(String modifyUser) {
        this.modifyUser = modifyUser;
    }

    public String getModifyTime() {
        return modifyTime;
    }

    public void setModifyTime(String modifyTime) {
        this.modifyTime = modifyTime;
    }

    public Integer getValidSign() {
        return validSign;
    }

    public void setValidSign(Integer validSign) {
        this.validSign = validSign;
    }

    @Override
    public String toString() {
        return "User{" +
                "userAcct='" + userAcct + '\'' +
                ", userAcctCn='" + userAcctCn + '\'' +
                ", userPwd='" + userPwd + '\'' +
                ", userPwdRepeat='" + userPwdRepeat + '\'' +
                ", userAcctDesc='" + userAcctDesc + '\'' +
                ", userAcctTypeCode='" + userAcctTypeCode + '\'' +
                ", userAcctTypeValue='" + userAcctTypeValue + '\'' +
                ", userSerial='" + userSerial + '\'' +
                ", wechatOpenid='" + wechatOpenid + '\'' +
                ", userPId='" + userPId + '\'' +
                ", userDId='" + userDId + '\'' +
                ", userOId='" + userOId + '\'' +
                ", userRId='" + userRId + '\'' +
                ", userName='" + userName + '\'' +
                ", userSexCode='" + userSexCode + '\'' +
                ", userSexValue='" + userSexValue + '\'' +
                ", userGradeCode='" + userGradeCode + '\'' +
                ", userGradeValue='" + userGradeValue + '\'' +
                ", userBirth=" + userBirth +
                ", politicalFaceCode='" + politicalFaceCode + '\'' +
                ", politicalFaceValue='" + politicalFaceValue + '\'' +
                ", nativePlaceCode='" + nativePlaceCode + '\'' +
                ", nativePlaceValue='" + nativePlaceValue + '\'' +
                ", connEmail1='" + connEmail1 + '\'' +
                ", connPhone1='" + connPhone1 + '\'' +
                ", connAdd1='" + connAdd1 + '\'' +
                ", connEmail2='" + connEmail2 + '\'' +
                ", connPhone2='" + connPhone2 + '\'' +
                ", connAdd2='" + connAdd2 + '\'' +
                ", connQq='" + connQq + '\'' +
                ", connMsn='" + connMsn + '\'' +
                ", createUser='" + createUser + '\'' +
                ", createTime='" + createTime + '\'' +
                ", modifyUser='" + modifyUser + '\'' +
                ", modifyTime='" + modifyTime + '\'' +
                ", validSign=" + validSign +
                ", id='" + id + '\'' +
                '}';
    }
}
