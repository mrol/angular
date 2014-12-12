package ru.cinimex.dao;

import org.hibernate.Criteria;
import org.hibernate.HibernateException;
import org.hibernate.Session;
import org.hibernate.criterion.DetachedCriteria;
import org.hibernate.criterion.Projections;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.orm.hibernate3.HibernateCallback;
import org.springframework.orm.hibernate3.support.HibernateDaoSupport;

import java.io.Serializable;
import java.util.List;

/**
 * Created by ilapin on 12.12.2014.
 * Cinimex-Informatica
 */
public class AHibernateDao extends HibernateDaoSupport {
    protected static Logger logger = LoggerFactory.getLogger(AHibernateDao.class);

//    @SuppressWarnings("serial")
//    public static final MatchMode PATTERN_MATCH_MODE_START = new MatchMode("PATTERN_MATCH_MODE_START")
//    {
//        public String toMatchString(String pattern)
//        {
//            return pattern.replace('*', '%') + '%';
//        }
//    };

    /**
     * Get unique result by criteria
     *
     * @param detachedCriteria
     * @return entity
     */
    @SuppressWarnings("unchecked")
    public <X extends Serializable> X getByCriteria(DetachedCriteria detachedCriteria) {
        List<X> list = (List<X>) getHibernateTemplate().findByCriteria(detachedCriteria, 0, 1);

        if (list.size() == 0)
            return null;

        return list.get(0);
    }

    @SuppressWarnings("unchecked")
    public <X extends Serializable> List<X> getListByCriteria(DetachedCriteria detachedCriteria) {
        return (List<X>) getHibernateTemplate().findByCriteria(detachedCriteria);
    }

    /**
     * Get number of entities that match criteria
     *
     * @param detachedCriteria criteria we count
     * @return number of entries that match
     */
    public int getCountByCriteria(final DetachedCriteria detachedCriteria) {
        Number count = (Number) getHibernateTemplate().execute(new HibernateCallback() {
            public Object doInHibernate(Session session) throws HibernateException {
                Criteria criteria = detachedCriteria.getExecutableCriteria(session);
                criteria.setProjection(Projections.rowCount());

                return criteria.uniqueResult();
            }
        });

        detachedCriteria.setProjection(null);
        detachedCriteria.setResultTransformer(DetachedCriteria.ROOT_ENTITY);

        if (count != null)
            return count.intValue();

        return 0;
    }

//    /**
//     * Adds order by clause to criteria
//     *
//     * @param detachedCriteria	criteria which we add order to
//     * @param sortConfig		sort config we add
//     */
//    public void setCriteriaSortConfig(final DetachedCriteria detachedCriteria, final ISortConfig sortConfig)
//    {
//        if (sortConfig == null)
//            return;
//
//        if (sortConfig.getField() == null || sortConfig.getOrder() == null || sortConfig.getOrder() == SortOrder.NONE)
//            return;
//
//        if (SortOrder.ASC == sortConfig.getOrder())
//            detachedCriteria.addOrder(Order.asc(sortConfig.getField()));
//        else if (SortOrder.DESC == sortConfig.getOrder())
//            detachedCriteria.addOrder(Order.desc(sortConfig.getField()));
//    }
}
