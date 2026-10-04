package com.aaiimm.kk.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import com.aaiimm.kk.Repo.repo;
import com.aaiimm.kk.ent.ent;
import java.util.Optional;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private repo repository;

   @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Optional<ent> userOptional = repository.findByEmail(email);
        if (userOptional.isEmpty()) {
            throw new UsernameNotFoundException("User not found with email: " + email);
        }
        
        ent user = userOptional.get();
        
        String userRole = user.getRole();
        if (userRole == null || userRole.isEmpty()) {
            userRole = "USER";
        }
        
        return User.builder()
                .username(user.getEmail())
                .password(user.getPassword())
                .roles(userRole) 
                .build();
    }
}