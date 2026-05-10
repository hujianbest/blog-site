package com.example.writingplatform.repository;

import com.example.writingplatform.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {

    List<Category> findByParentIdOrderByCreatedAtAsc(Long parentId);

    @Query("SELECT c FROM Category c WHERE c.parentId IS NULL ORDER BY c.createdAt ASC")
    List<Category> findRootCategories();

    @Query("SELECT c FROM Category c LEFT JOIN FETCH c.children WHERE c.parentId IS NULL")
    List<Category> findRootCategoriesWithChildren();
}
