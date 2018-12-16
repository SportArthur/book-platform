package com.souche.insurance.model.shop;

import java.io.Serializable;

/**
 * @author : Arthur
 * @date 创建时间：Dec 16, 2018 9:44:46 AM
 */
public class BookShopQueryParam implements Serializable {

	private static final long serialVersionUID = 123423422312L;
	private Integer id; // 主键-店铺编码
	private String shopName; // 店铺名称
	private String shopAddress; // 店铺地址
	private String shopOwnerName; // 店铺老板名字
	private String shopPhone; // 店铺老板电话
	private Integer authStatus; // 授权状态 0：未授权，1：已授权 2：已取消
	private String dateCreateStart; // 创建时间-起
	private String dateCreateEnd; // 创建时间-止

	private Integer page = 1;
	private Integer pageSize = 10;

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

	public String getDateCreateStart() {
		return dateCreateStart;
	}

	public void setDateCreateStart(String dateCreateStart) {
		this.dateCreateStart = dateCreateStart;
	}

	public String getDateCreateEnd() {
		return dateCreateEnd;
	}

	public void setDateCreateEnd(String dateCreateEnd) {
		this.dateCreateEnd = dateCreateEnd;
	}

	public static long getSerialversionuid() {
		return serialVersionUID;
	}

	public Integer getPage() {
		return page;
	}

	public void setPage(Integer page) {
		this.page = page;
	}

	public Integer getPageSize() {
		return pageSize;
	}

	public void setPageSize(Integer pageSize) {
		this.pageSize = pageSize;
	}

}
