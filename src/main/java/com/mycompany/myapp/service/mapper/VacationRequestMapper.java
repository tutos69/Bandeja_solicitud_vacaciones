package com.mycompany.myapp.service.mapper;

import com.mycompany.myapp.domain.Employee;
import com.mycompany.myapp.domain.User;
import com.mycompany.myapp.domain.VacationRequest;
import com.mycompany.myapp.service.dto.EmployeeDTO;
import com.mycompany.myapp.service.dto.UserDTO;
import com.mycompany.myapp.service.dto.VacationRequestDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link VacationRequest} and its DTO {@link VacationRequestDTO}.
 */
@Mapper(componentModel = "spring")
public interface VacationRequestMapper extends EntityMapper<VacationRequestDTO, VacationRequest> {
    @Mapping(target = "employee", source = "employee", qualifiedByName = "employeeId")
    @Mapping(target = "approver", source = "approver", qualifiedByName = "userLogin")
    VacationRequestDTO toDto(VacationRequest s);

    @Named("employeeId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    EmployeeDTO toDtoEmployeeId(Employee employee);

    @Named("userLogin")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    @Mapping(target = "login", source = "login")
    UserDTO toDtoUserLogin(User user);
}
