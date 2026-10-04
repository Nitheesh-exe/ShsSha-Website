package com.aaiimm.kk.Repo;

import org.springframework.data.jpa.repository.JpaRepository;
import com.aaiimm.kk.ent.OrderDetails;

public interface OrderRepo extends JpaRepository<OrderDetails, Integer> {
}