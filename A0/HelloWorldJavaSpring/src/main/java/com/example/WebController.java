package com.example;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * Created by Ryan on 1/7/17.
 */

@RestController
public class WebController {

    @RequestMapping("/a0")
    public String greeting(@RequestParam(value="name", defaultValue="World") String name) {
        return "<h1>Hello, " + name + "!</h1>";
    }
}
