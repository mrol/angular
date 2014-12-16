package ru.cinimex.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ru.cinimex.dao.FunnyNameDao;
import ru.cinimex.model.FunnyName;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import java.util.List;

/**
 * Created by ilapin on 12.12.2014.
 * Cinimex-Informatica
 */

@Path("/json/funny_names")
@Service
public class FunnyNameManager {

    @Autowired
    FunnyNameDao funnyNameDao;

    @GET
    @Path("/")
    @Produces("application/json")
    public List<FunnyName> getList() {
        return funnyNameDao.getList();
    }

    @GET
    @Path("/{id}")
    @Produces("application/json")
    public FunnyName getById(@PathParam("id") long funnyNameId) {

        return funnyNameDao.getById(funnyNameId);
    }
}
