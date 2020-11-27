package com.example.koboard.model;

import java.util.ArrayList;

public class ListKourse {

    private String id;
    private String dashboard;
    private String title;
    private ArrayList<Product> products;

    public ListKourse() {
    }

    public ListKourse(String id, String dashboard, String title, ArrayList<Product> products) {
        this.dashboard = dashboard;
        this.title = title;
        this.products = products;
        this.id = id;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getDashboard() {
        return dashboard;
    }

    public void setDashboard(String dashboard) {
        this.dashboard = dashboard;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public ArrayList<Product> getProducts() {
        return products;
    }

    public void setProducts(ArrayList<Product> products) {
        this.products = products;
    }
}
