package com.example.koboard.model;

public class Product {

    private String id;
    private String productName;
    private boolean isChecked;

    public Product(String id, String productName, boolean isChecked) {
        this.productName = productName;
        this.isChecked = isChecked;
        this.id = id;
    }

    public Product() {
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public boolean isChecked() {
        return isChecked;
    }

    public void setChecked(boolean checked) {
        isChecked = checked;
    }
}
