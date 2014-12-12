package ru.cinimex.dao;

import org.hibernate.criterion.DetachedCriteria;
import ru.cinimex.model.FunnyName;

import java.util.List;

/**
 * Created by ilapin on 12.12.2014.
 * Cinimex-Informatica
 */
public class FunnyNameDao extends AHibernateDao {

    public List<FunnyName> getList() {
        DetachedCriteria criteria = DetachedCriteria.forClass(FunnyName.class);
        return getListByCriteria(criteria);
    }

    public Integer count() {
        DetachedCriteria criteria = DetachedCriteria.forClass(FunnyName.class);
        return getCountByCriteria(criteria);
    }
}
