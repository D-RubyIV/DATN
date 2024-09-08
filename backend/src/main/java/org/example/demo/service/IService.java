package org.example.demo.service;

import org.apache.coyote.BadRequestException;

/**
 * @param <E> Entity
 * @param <ID> Kiểu dữ liệu ID của Entity
 * @param <RQ> Đối tượng requestDTO
 * @param <RS> Đối tượng responseDTO
**/
public interface IService<E, ID, RQ> {
    E findById(ID id) throws BadRequestException;
    E delete(ID id, int status) throws BadRequestException;
    E save(RQ requestDTO);
    E update(ID id, RQ requestDTO);
}
