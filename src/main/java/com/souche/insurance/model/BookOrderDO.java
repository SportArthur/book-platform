package com.souche.insurance.model;

import java.io.Serializable;
import java.util.Date;

import com.souche.optimus.dao.annotation.SqlTable;

/**
 * @author : Arthur
 * @date 创建时间：Dec 5, 2018 3:14:06 PM
 */
@SqlTable("book_order")
public class BookOrderDO implements Serializable {

	private static final long serialVersionUID = 14432133L;

	private Integer id; // 主键
	private String shopCode; // 店铺编码
	private String buyerName; // 买家名称
	private String buyerAddress; // 买家地址
	private String buyerPhone; // 买家电话
	private Date bookTime; // 预定时间
	private String productName; // 产品名称
	private Integer productPrice; // 产品价格
	private Integer orderStatus; // 订单状态 0：已预定，1：已服务 2：已关闭
	private Date dateCreate; // 创建时间
	private Date dateUpdate; // 修改时间

	private Integer page = 1; // 产品价格
	private Integer pageSize = 10; // 订单状态 0：已预定，1：已服务 2：已关闭

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

	public Date getBookTime() {
		return bookTime;
	}

	public void setBookTime(Date bookTime) {
		this.bookTime = bookTime;
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

}
