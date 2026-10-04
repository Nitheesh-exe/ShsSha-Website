package com.aaiimm.kk.Repo;

import org.springframework.data.jpa.repository.JpaRepository;
import com.aaiimm.kk.ent.ent;
import java.util.Optional;

public interface repo extends JpaRepository<ent, Integer> {
    Optional<ent> findByEmail(String email);
}