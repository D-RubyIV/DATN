package org.example.demo.mapper;


import java.util.List;

public interface IMapper <E, D>{
    E toEntity(D d);
    List<E> toListEntity(List<D> d);


    D toDTO(E e);
    List<D> toListDTO(List<E> e);
}
