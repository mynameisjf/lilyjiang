
package com.jiangf.model;

import com.baomidou.mybatisplus.annotation.*;

import java.io.Serializable;
import java.util.Date;

/**
 * 字典项
 */
@TableName("T_FW_DICTIONARY")
public class Dictionary implements Serializable {
	private static final long serialVersionUID = -4831793558587348756L;

	/**
	 * 主键
	 */
	@TableId
	private String pkid; 
	
	/**
	 * 分类ID
	 */
	private String catalogId; 
	
	/**
	 * 字典代码
	 */
	private String dicCode; 
	
	/**
	 * 字典值
	 */
	private String dicValue; 
	
	/**
	 * 显示顺序
	 */
	private Integer showIndex; 
	
	/**
	 * 描述
	 */
	private String note; 

	/**
	 * 创建时间
	 */
	private Date createTime;

	@TableLogic
	@TableField(fill= FieldFill.INSERT)
	protected Integer validSign;

	public String getPkid() {
		return pkid;
	}

	public void setPkid(String pkid) {
		this.pkid = pkid;
	}

	public String getCatalogId() {
		return catalogId;
	}

	public void setCatalogId(String catalogId) {
		this.catalogId = catalogId;
	}

	public String getDicCode() {
		return dicCode;
	}

	public void setDicCode(String dicCode) {
		this.dicCode = dicCode;
	}

	public String getDicValue() {
		return dicValue;
	}

	public void setDicValue(String dicValue) {
		this.dicValue = dicValue;
	}

	public Integer getShowIndex() {
		return showIndex;
	}

	public void setShowIndex(Integer showIndex) {
		this.showIndex = showIndex;
	}

	public String getNote() {
		return note;
	}

	public void setNote(String note) {
		this.note = note;
	}

	public Date getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Date createTime) {
		this.createTime = createTime;
	}

	public Integer getValidSign() {
		return validSign;
	}

	public void setValidSign(Integer validSign) {
		this.validSign = validSign;
	}
}
