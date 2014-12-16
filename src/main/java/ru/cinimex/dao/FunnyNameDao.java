package ru.cinimex.dao;

import org.hibernate.criterion.DetachedCriteria;
import org.hibernate.criterion.Restrictions;
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

    public FunnyName getById(Long id) {
        DetachedCriteria criteria = DetachedCriteria.forClass(FunnyName.class);
        criteria.add(Restrictions.eq("id", id));
        return getByCriteria(criteria);
    }

    public void deleteById(long funnyNameId) {
        FunnyName funnyName = getById(funnyNameId);
        if (funnyName != null) {
            getHibernateTemplate().delete(funnyName);
        } else {
            logger.warn("Couldn't delete FunnyName from database, because not found. Requested id: " + funnyNameId);
        }
    }

    public void saveOrUpdate(FunnyName funnyName) throws Exception {
        getHibernateTemplate().saveOrUpdate(funnyName);
    }
}
