package com.example.koboard.ui.Kourse;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.Context;
import android.content.DialogInterface;

import androidx.fragment.app.FragmentActivity;
import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;
import androidx.lifecycle.ViewModel;

import com.example.koboard.R;
import com.example.koboard.httpUtils.HtppModifierNote;
import com.example.koboard.httpUtils.HttpCreerKourse;
import com.example.koboard.httpUtils.HttpCreerNote;
import com.example.koboard.httpUtils.HttpModifierKourse;
import com.example.koboard.httpUtils.HttpRecupererKourse;
import com.example.koboard.httpUtils.HttpRecupererNotes;
import com.example.koboard.httpUtils.HttpRecupererUtilisateurs;
import com.example.koboard.model.ListKourse;
import com.example.koboard.model.Note;
import com.example.koboard.model.Product;
import com.example.koboard.model.Utilisateur;
import com.example.koboard.ui.Konote.KonoteAdaptaterListView;

import java.util.ArrayList;

public class KourseViewModel extends ViewModel {

    public static ArrayList<ListKourse> listeKourses;
    private static Context context;
    private static Activity activity;

    public KourseViewModel() {
        listeKourses = new ArrayList<ListKourse>();
    }

    public void setContextActivity(Context context, Activity activity){
        this.context = context;
        this.activity = activity;
    }

    public void getProductList(){
        new HttpRecupererKourse(new HttpRecupererKourse.AsyncResponse() {
            @Override
            public void processFinish(final ArrayList<ListKourse> listKourse) {
                listeKourses = listKourse;
            }
        }, context).execute();
    }

    public ArrayList<Product> getProducts(String id){
        ArrayList<Product> products = new ArrayList<Product>();
        for (ListKourse kourses : listeKourses){
            if (kourses.getId().equals(id)){
                products = kourses.getProducts();
            }
        }
        return products;
    }

    public void createList(String name){
        ListKourse kourses = new ListKourse("", listeKourses.get(0).getDashboard(), name, new ArrayList<Product> ());
        new HttpCreerKourse(kourses, new HttpCreerKourse.AsyncResponse() {
            @Override
            public void processFinish(boolean error) {
                if(error) {
                    AlertDialog.Builder builder = new AlertDialog.Builder(KourseViewModel.context);
                    builder.setMessage("Une erreur est survenue dans la communication avec le serveur")
                            .setPositiveButton("Ok", new DialogInterface.OnClickListener() {
                                public void onClick(DialogInterface dialog, int id) {
                                }
                            }).setTitle("Erreur");
                    builder.create();
                    builder.show();
                }
            }
        }, KourseViewModel.context).execute();
    }

    public void createProduct(String id_listeKourse, String name){

        Product prod = new Product("", name, false);
        ListKourse listKourse = new ListKourse();
        for (ListKourse kourses : listeKourses){
            if (kourses.getId().equals(id_listeKourse)){
                listKourse = kourses;
            }
        }
        ArrayList<Product> prods = listKourse.getProducts();
        prods.add(prod);
        listKourse.setProducts(prods);
        //Envoie à la bdd


        new HttpModifierKourse(listKourse, new HttpModifierKourse.AsyncResponse() {
            @Override
            public void processFinish(boolean error) {
                if(error) {
                    AlertDialog.Builder builder = new AlertDialog.Builder(context);
                    builder.setMessage("Une erreur est survenue dans la communication avec le serveur")
                            .setPositiveButton("Ok", new DialogInterface.OnClickListener() {
                                public void onClick(DialogInterface dialog, int id) {
                                }
                            }).setTitle("Erreur");
                    builder.create();
                    builder.show();
                }
            }
        }, context).execute();
    }

    public void modifyProduct(String id_listeKourse, String id, String name){
        ListKourse listKourse = new ListKourse();
        for (ListKourse kourses : listeKourses){
            if (kourses.getId().equals(id_listeKourse)){
                listKourse = kourses;
            }
        }
        ArrayList<Product> prods = listKourse.getProducts();
        for(Product prod : prods){
            if (prod.getId() == id){
                prod.setProductName(name);
            }
        }
        listKourse.setProducts(prods);
        //Envoie à la bdd


        new HttpModifierKourse(listKourse, new HttpModifierKourse.AsyncResponse() {
            @Override
            public void processFinish(boolean error) {
                if(error) {
                    AlertDialog.Builder builder = new AlertDialog.Builder(context);
                    builder.setMessage("Une erreur est survenue dans la communication avec le serveur")
                            .setPositiveButton("Ok", new DialogInterface.OnClickListener() {
                                public void onClick(DialogInterface dialog, int id) {
                                }
                            }).setTitle("Erreur");
                    builder.create();
                    builder.show();
                }
            }
        }, context).execute();
    }

    public static void checkProduct(String id_listeKourse, String id, boolean isChecked){
        ListKourse listKourse = new ListKourse();
        for (ListKourse kourses : listeKourses){
            if (kourses.getId().equals(id_listeKourse)){
                listKourse = kourses;
            }
        }
        ArrayList<Product> prods = listKourse.getProducts();
        for(Product prod : prods){
            if (prod.getId() == id){
                prod.setChecked(isChecked);
            }
        }
        listKourse.setProducts(prods);
        //Envoie à la bdd


        new HttpModifierKourse(listKourse, new HttpModifierKourse.AsyncResponse() {
            @Override
            public void processFinish(boolean error) {
                if(error) {
                    AlertDialog.Builder builder = new AlertDialog.Builder(context);
                    builder.setMessage("Une erreur est survenue dans la communication avec le serveur")
                            .setPositiveButton("Ok", new DialogInterface.OnClickListener() {
                                public void onClick(DialogInterface dialog, int id) {
                                }
                            }).setTitle("Erreur");
                    builder.create();
                    builder.show();
                }
            }
        }, context).execute();
    }

    public static void deleteProduct(String id_listeKourse, String id){

        ListKourse listKourse = new ListKourse();
        for (ListKourse kourses : listeKourses){
            if (kourses.getId().equals(id_listeKourse)){
                listKourse = kourses;
            }
        }
        ArrayList<Product> prods = listKourse.getProducts();
        Product toDel = new Product();
        for(Product prod : prods){
            if (prod.getId() == id){
                toDel = prod;
            }
        }
        prods.remove(toDel);
        listKourse.setProducts(prods);
        //Envoie à la bdd


        new HttpModifierKourse(listKourse, new HttpModifierKourse.AsyncResponse() {
            @Override
            public void processFinish(boolean error) {
                if(error) {
                    AlertDialog.Builder builder = new AlertDialog.Builder(context);
                    builder.setMessage("Une erreur est survenue dans la communication avec le serveur")
                            .setPositiveButton("Ok", new DialogInterface.OnClickListener() {
                                public void onClick(DialogInterface dialog, int id) {
                                }
                            }).setTitle("Erreur");
                    builder.create();
                    builder.show();
                }
            }
        }, context).execute();
    }

    private static String getNameListe(int compteur){
        return listeKourses.get(compteur).getTitle();
    }

    public static Product getProductById(String id_listeKourse, String id_Product){
        Product product = new Product();
        for (ListKourse kourses : listeKourses){
            if (kourses.getId().equals(id_listeKourse)){
                ArrayList<Product> products = kourses.getProducts();
                for (Product prod : products){
                    if (prod.getId().equals(id_Product)){
                        product = prod;
                    }
                }
            }
        }
        return product;
    }
}