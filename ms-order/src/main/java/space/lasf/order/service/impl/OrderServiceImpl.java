package space.lasf.order.service.impl;

import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;
import space.lasf.order.core.util.ObjectsValidator;
import space.lasf.order.domain.model.Order;
import space.lasf.order.domain.model.OrderItem;
import space.lasf.order.domain.repository.OrderItemRepository;
import space.lasf.order.domain.repository.OrderRepository;
import space.lasf.order.dto.OrderDto;
import space.lasf.order.dto.OrderItemDto;
import space.lasf.order.service.OrderService;

/**
 * Implementação do serviço para gerenciamento de pedidos.
 */
@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    @Autowired
    private final OrderRepository repository;

    @Autowired
    private final OrderItemRepository orderItemRepository;

    @Autowired
    private ModelMapper modelMapper;

    @Autowired
    private final ObjectsValidator<Order> validador;

    @Autowired
    private final ObjectsValidator<OrderItem> itemValidator;

    @Override
    @Transactional
    public OrderDto createOrder(final OrderDto dto) {
        Order orderEntity = modelMapper.map(dto, Order.class);
        orderEntity.setId(null); // Garante que o ID seja nulo para criação
        validador.validate(orderEntity);

        Order result = repository.save(orderEntity);

        if (result == null) {
            throw new IllegalStateException("Erro ao atualizar o pedido com ID: " + dto.getId());
        }

        List<OrderItem> itemEntities = dto.getItemList().stream()
                .map(p -> {
                    OrderItem item = modelMapper.map(p, OrderItem.class);
                    item.setId(null); // Garante que o ID seja nulo para criação
                    item.setOrderId(result.getId());
                    itemValidator.validate(item);
                    return item;
                })
                .collect(Collectors.toList());

        orderItemRepository.saveAll(itemEntities);

        OrderDto resultDto = modelMapper.map(result, OrderDto.class);
        List<OrderItemDto> resultItemDtos = itemEntities.stream()
                .map(p -> modelMapper.map(p, OrderItemDto.class))
                .collect(Collectors.toList());
        resultDto.setItemList(resultItemDtos);
        return resultDto;
    }

    @Override
    @Transactional
    public OrderDto updateOrder(final OrderDto dto) {
        Order orderEntity = modelMapper.map(dto, Order.class);
        validador.validate(orderEntity);

        Order result = repository.save(orderEntity);

        if (result == null) {
            throw new IllegalStateException("Erro ao atualizar o pedido com ID: " + dto.getId());
        }

        List<OrderItem> itemEntities = dto.getItemList().stream()
                .map(p -> {
                    OrderItem item = modelMapper.map(p, OrderItem.class);
                    item.setOrderId(orderEntity.getId());
                    itemValidator.validate(item);
                    return item;
                })
                .collect(Collectors.toList());

        orderItemRepository.deleteByOrderId(result.getId());
        orderItemRepository.saveAll(itemEntities);

        OrderDto resultDto = modelMapper.map(result, OrderDto.class);
        List<OrderItemDto> resultItemDtos = itemEntities.stream()
                .map(p -> modelMapper.map(p, OrderItemDto.class))
                .collect(Collectors.toList());
        resultDto.setItemList(resultItemDtos);
        return resultDto;
    }

    @Override
    @Transactional(readOnly = true, isolation = Isolation.SERIALIZABLE)
    public OrderDto getOrderById(final Long id) {
        Order entityIn = repository
                .findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Pedido não encontrado com ID: " + id));
        OrderDto orderDto = modelMapper.map(entityIn, OrderDto.class);
        return orderDto;
    }

    @Override
    @Transactional(readOnly = true)
    public List<OrderDto> getAllOrders() {
        List<Order> orderEntities = repository.findAll();

        return orderEntities.stream()
                .map(p -> modelMapper.map(p, OrderDto.class))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<OrderDto> getOrdersByCustomerId(final Long customerId) {
        List<Order> orderEntities = repository.findByCustomerId(customerId);
        return orderEntities.stream()
                .map(order -> modelMapper.map(order, OrderDto.class))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void deleteOrder(final Long id) {
        if (repository.findById(id).isPresent()) {
            orderItemRepository.deleteByOrderId(id);
            repository.deleteById(id);
        } else {
            throw new IllegalArgumentException("Pedido não encontrado com ID: " + id);
        }
    }

    @Override
    @Transactional
    public boolean deleteOrdersByCustomerId(final Long customerId) {
        List<OrderDto> orders = getOrdersByCustomerId(customerId);
        if (orders.isEmpty()) {
            return false;
        }
        repository.deleteByCustomerId(customerId);
        return true;
    }
}
