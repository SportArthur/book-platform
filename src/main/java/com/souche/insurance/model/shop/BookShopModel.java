package com.souche.insurance.model.shop;

import java.io.Serializable;
import java.util.Date;

/**
 * @author : Arthur
 * @date 创建时间：Dec 16, 2018 9:44:46 AM
 */
public class BookShopModel implements Serializable {

	private static final long serialVersionUID = 123423422312L;
	private Integer id; // 主键-店铺编码
	private String shopName; // 店铺名称
	private String shopAddress; // 店铺地址
	private String shopOwnerName; // 店铺老板名字
	private String shopPhone; // 店铺老板电话
	private Integer authStatus; // 授权状态 0：未授权，1：已授权 2：已取消
	private String remarks; // 备注
	private Date dateCreate; // 创建时间
	private Date dateUpdate; // 修改时间

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}
	
	public String getShopName() {
		return shopName;
	}

	public void setShopName(String shopName) {
		this.shopName = shopName;
	}

	public String getShopAddress() {
		return shopAddress;
	}

	public void setShopAddress(String shopAddress) {
		this.shopAddress = shopAddress;
	}

	public String getShopOwnerName() {
		return shopOwnerName;
	}

	public void setShopOwnerName(String shopOwnerName) {
		this.shopOwnerName = shopOwnerName;
	}

	public String getShopPhone() {
		return shopPhone;
	}

	public void setShopPhone(String shopPhone) {
		this.shopPhone = shopPhone;
	}

	public Integer getAuthStatus() {
		return authStatus;
	}

	public void setAuthStatus(Integer authStatus) {
		this.authStatus = authStatus;
	}

	public String getRemarks() {
		return remarks;
	}

	public void setRemarks(String remarks) {
		this.remarks = remarks;
	}

	public Date getDateCreate() {
		return dateCreate;
	}

	public void setDateCreate(Date dateCreate) {
		this.dateCreate = dateCreate;
	}

	public Date getDateUpdate() {
		return dateUpdate;
	}

	public void setDateUpdate(Date dateUpdate) {
		this.dateUpdate = dateUpdate;
	}

	public static long getSerialversionuid() {
		return serialVersionUID;
	}

}
