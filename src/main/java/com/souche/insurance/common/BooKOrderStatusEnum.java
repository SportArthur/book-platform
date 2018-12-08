package com.souche.insurance.common;

/**
 * 订单状态枚举 0：已预定，1：已服务 2：已关闭
 * 
 * @author : Arthur
 * @date 创建时间：Dec 8, 2018 12:26:36 PM
 */
public enum BooKOrderStatusEnum {
	
	BOOKED(0, "已预定"), 
	SERVERED(1, "已服务"), 
	CLOSED(2, "已关闭");

	private int status;

	private String meaning;

	BooKOrderStatusEnum(int status, String meaning) {
		this.status = status;
		this.meaning = meaning;
	}

	/**
	 * Getter method for property <tt>status</tt>.
	 *
	 * @return property value of status
	 */
	public int getStatus() {
		return status;
	}

	/**
	 * Setter method for property <tt>status</tt>.
	 *
	 * @param status
	 *            value to be assigned to property status
	 */
	public void setStatus(int status) {
		this.status = status;
	}

	/**
	 * Getter method for property <tt>meaning</tt>.
	 *
	 * @return property value of meaning
	 */
	public String getMeaning() {
		return meaning;
	}

	/**
	 * Setter method for property <tt>meaning</tt>.
	 *
	 * @param meaning
	 *            value to be assigned to property meaning
	 */
	public void setMeaning(String meaning) {
		this.meaning = meaning;
	}

	public static String getMeaningByStatus(int status) {
		for (BooKOrderStatusEnum tmp : BooKOrderStatusEnum.values()) {
			if (tmp.getStatus() == status) {
				return tmp.getMeaning();
			}
		}
		return "";
	}
}
