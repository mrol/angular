package ru.cinimex.rest;

import org.codehaus.jackson.map.DeserializationConfig;
import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.map.SerializationConfig;

import javax.ws.rs.Produces;
import javax.ws.rs.ext.ContextResolver;
import javax.ws.rs.ext.Provider;
import java.text.SimpleDateFormat;

/**
 * Created by ilapin on 16.12.2014.
 * Cinimex-Informatica
 */
@Provider
@Produces("application/json")
public class JacksonConfigurator implements ContextResolver<ObjectMapper> {
    public final static SimpleDateFormat DATE_FORMAT = new SimpleDateFormat(
            "yyyy-MM-dd'T'HH:mm:ss.SSSZ");

    private ObjectMapper mapper = new ObjectMapper();

    public JacksonConfigurator() {
        SerializationConfig serConfig = mapper.getSerializationConfig();
        serConfig.setDateFormat(DATE_FORMAT);
        DeserializationConfig deserializationConfig = mapper.getDeserializationConfig();
        deserializationConfig.setDateFormat(new SimpleDateFormat("yyyy-MM-dd"));
        mapper.configure(SerializationConfig.Feature.WRITE_DATES_AS_TIMESTAMPS, false);
    }

    @Override
    public ObjectMapper getContext(Class<?> arg0) {
        return mapper;
    }

}
