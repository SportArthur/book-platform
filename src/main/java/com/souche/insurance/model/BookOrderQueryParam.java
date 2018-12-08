package com.souche.insurance.model;

import java.io.Serializable;

/**
 * 订单查询参数
 * 
 */
public class BookOrderQueryParam implements Serializable {

	private static final long serialVersionUID = 14432133L;

	private Integer id; // 主键
	private String shopCode; // 店铺编码
	private String buyerName; // 买家名称
	private String buyerAddress; // 买家地址
	private String buyerPhone; // 买家电话
	private String bookTimeStart; // 预定时间-起
	private String bookTimeEnd; // 预定时间-止
	private String productName; // 产品名称
	private Integer productPrice; // 产品价格
	private Integer orderStatus; // 订单状态 0：已预定，1：已服务 2：已关闭
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

	public String getShopCode() {
		return shopCode;
	}

	public void setShopCode(String shopCode) {
		this.shopCode = shopCode;
	}

	public String getBuyerName() {
		return buyerName;
	}

	public void setBuyerName(String buyerName) {
		this.buyerName = buyerName;
	}

	public String getBuyerAddress() {
		return buyerAddress;
	}

	public void setBuyerAddress(String buyerAddress) {
		this.buyerAddress = buyerAddress;
	}

	public String getBuyerPhone() {
		return buyerPhone;
	}

	public void setBuyerPhone(String buyerPhone) {
		this.buyerPhone = buyerPhone;
	}

	public String getProductName() {
		return productName;
	}

	public void setProductName(String productName) {
		this.productName = productName;
	}

	public Integer getProductPrice() {
		return productPrice;
	}

	public void setProductPrice(Integer productPrice) {
		this.productPrice = productPrice;
	}

	public Integer getOrderStatus() {
		return orderStatus;
	}

	public void setOrderStatus(Integer orderStatus) {
		this.orderStatus = orderStatus;
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

	public static long getSerialversionuid() {
		return serialVersionUID;
	}

	public String getBookTimeStart() {
		return bookTimeStart;
	}

	public void setBookTimeStart(String bookTimeStart) {
		this.bookTimeStart = bookTimeStart;
	}

	public String getBookTimeEnd() {
		return bookTimeEnd;
	}

	public void setBookTimeEnd(String bookTimeEnd) {
		this.bookTimeEnd = bookTimeEnd;
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

}
