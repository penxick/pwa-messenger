// Тестовый контроллер: нужен для быстрой проверки, что backend вообще работает.
package com.penx.messenger;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {

    @GetMapping("/api/test")
    public String test() {
        return "Backend works";
    }
}