package com.aaiimm.kk.ent;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "orders")
public class OrderDetails {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    
    private String fullName;
    private String phone;
    private String address;
    private String city;
    private String state;
    private String pincode;
    private String email;

    @Column(length = 2000)
    private String orderSummary;
    
    private String grandTotal;

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }
    
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    
    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }
    
    public String getState() { return state; }
    public void setState(String state) { this.state = state; }
    
    public String getPincode() { return pincode; }
    public void setPincode(String pincode) { this.pincode = pincode; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getOrderSummary() { return orderSummary; }
    public void setOrderSummary(String orderSummary) { this.orderSummary = orderSummary; }

    public String getGrandTotal() { return grandTotal; }
    public void setGrandTotal(String grandTotal) { this.grandTotal = grandTotal; }
}