package com.aaiimm.kk.controller; 

import java.security.Principal;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;

import com.aaiimm.kk.Ser.Ser;
import com.aaiimm.kk.ent.ent;
import com.aaiimm.kk.ent.OrderDetails;

@CrossOrigin(origins = "*")
@RestController 
@RequestMapping("/api")
public class Controller {
    
    @Autowired
    Ser ser;
    @Autowired
    private com.aaiimm.kk.Repo.OrderRepo orderRepo;
    
    @PostMapping("/checkout")
    public String processCheckout(@RequestBody OrderDetails orderData) {
        return ser.saveOrder(orderData);
    }
    
    @PostMapping("/insert")
    public String postMethodName(@RequestBody ent data) { 
        return ser.addBook(data);
    }
    
   @GetMapping("/user")
    public Map<String, String> getUser(Principal principal) {
        String email = principal.getName(); 
        Optional<ent> userOptional = ser.getUserByEmail(email);
        
        Map<String, String> userData = new HashMap<>();
        if(userOptional.isPresent()) {
            ent user = userOptional.get();
            userData.put("name", user.getName());
            userData.put("email", user.getEmail());

            String role = user.getRole() != null ? user.getRole() : "USER";
            userData.put("role", role); 
        }
        return userData;
    }
    
    
    @GetMapping("/orders")
    public java.util.List<com.aaiimm.kk.ent.OrderDetails> getAllOrders() {
        return orderRepo.findAll();
    }
}