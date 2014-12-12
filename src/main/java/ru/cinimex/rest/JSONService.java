package ru.cinimex.rest;

import ru.cinimex.model.Track;

import javax.ws.rs.*;
import javax.ws.rs.core.Response;


/**
 * Created by ilapin on 12.12.2014.
 * Cinimex-Informatica
 */

@Path("/json/metallica")
public class JSONService {

    @GET
    @Path("/get")
    @Produces("application/json")
    public Track getTrackInJSON() {
        return new Track("Enter Sandman", "Metallica");
    }

    @POST
    @Path("/post")
    @Consumes("application/json")
    public Response createTrackInJSON(Track track) {
        String result = "Track saved : " + track;
        return Response.status(201)
                .header("Content-Type", "application/json; charset=UTF-8")
                .entity(result).build();
    }
}
