package ru.cinimex.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

/**
 * Created by ilapin on 15.12.2014.
 * Cinimex-Informatica
 */
@Controller
public class StaticPagesController {
    @RequestMapping(value = "/", method = RequestMethod.GET)
    public String redirect() {

        return "redirect:index.html";
    }
}
