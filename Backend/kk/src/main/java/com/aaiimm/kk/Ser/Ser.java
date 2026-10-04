package com.aaiimm.kk.Ser; 

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.aaiimm.kk.Repo.repo;
import com.aaiimm.kk.Repo.OrderRepo;
import com.aaiimm.kk.ent.ent;
import com.aaiimm.kk.ent.OrderDetails;

@Service 
public class Ser {

    @Autowired 
    repo repository;

    @Autowired
    OrderRepo orderRepo; 

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public String addBook(ent data) {
        if (data.getPassword() != null) {
            data.setPassword(passwordEncoder.encode(data.getPassword()));
        }
        repository.save(data); 
        return "Data Inserted Successfully";
    }

    public Optional<ent> getBook(ent data, int id){
        return repository.findById(id);
    }

    public List<ent> getAllBooks() {
        return repository.findAll();
    }
    public Optional<ent> getUserByEmail(String email) {
        return repository.findByEmail(email);
    }

    public String updateBook(ent data) {
        if (data.getPassword() != null && !data.getPassword().startsWith("$2a$")) {
            data.setPassword(passwordEncoder.encode(data.getPassword()));
        }
        repository.save(data);
        return "Data Updated Successfully";
    }

    public String deleteBook(int id) {
        repository.deleteById(id);
        return "Data Deleted Successfully";
    }

    public String saveOrder(OrderDetails order) {
        orderRepo.save(order);
        return "Order Saved Successfully";
    }
}