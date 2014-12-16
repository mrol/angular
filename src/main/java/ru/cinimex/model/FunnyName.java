package ru.cinimex.model;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Date;

/**
 * Created by ilapin on 12.12.2014.
 * Cinimex-Informatica
 */
@Entity
@Table(name = "FUNNY_NAME", schema = "CCC12_REFERENCE")
@AttributeOverride(name = "id", column = @Column(name = "ID"))
@SequenceGenerator(name = "SEQ", sequenceName = "SEQ_REFERENCE", allocationSize = 1)
public class FunnyName implements Serializable{

    private static final long serialVersionUID = 5421589831587725351L;
    @Id
    @GeneratedValue(generator = "SEQ",strategy = GenerationType.SEQUENCE)
    Long id;

    @Column(name = "CODE")
    String code;

    @Column(name = "NAME")
    String name;

    @Column(name = "ENABLED")
    Boolean enabled;

    @Column(name = "MODIFIED_BY")
    String modifiedBy;

    @Column(name = "MODIFIED_DATE")
    Date modifiedDate;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Boolean getEnabled() {
        return enabled;
    }

    public void setEnabled(Boolean enabled) {
        this.enabled = enabled;
    }

    public String getModifiedBy() {
        return modifiedBy;
    }

    public void setModifiedBy(String modifiedBy) {
        this.modifiedBy = modifiedBy;
    }

    public Date getModifiedDate() {
        return modifiedDate;
    }

    public void setModifiedDate(Date modifiedDate) {
        this.modifiedDate = modifiedDate;
    }
}
