package org.example.demo.mapper.auth.response;

import org.example.demo.dto.auth.response.AccountResponseDTO;
import org.example.demo.entity.security.Account;
import org.example.demo.mapper.IMapperBasic;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface AccountResponseMapper extends IMapperBasic<Account , AccountResponseDTO> {
}
