<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Person
 *
 * @ORM\Table(name="people")
 * @ORM\Entity(repositoryClass="AppBundle\Repository\PersonRepository")
 */
class Person
{
    /**
     * @var int
     *
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @var string
     *
     * @ORM\Column(name="name", type="string", length=100, unique=true)
     */
    private $name;

    /**
     * @var string
     *
     * @ORM\Column(name="fields", type="string", length=255)
     */
    private $fields;

    /**
     * @ORM\OneToMany(targetEntity="VitalStat", mappedBy="person", orphanRemoval=true, cascade={"persist"})
     */
    protected $vitalStats;


    public function getId()
    {
        return $this->id;
    }

    public function setName($name)
    {
        $this->name = $name;

        return $this;
    }

    public function getFields()
    {
        return !empty($this->fields) ? json_decode($this->fields) : null;
    }

    public function setFields($fields)
    {
        $this->fields = $fields;

        return $this;
    }

    public function getName()
    {
        return $this->name;
    }

    public function __toString() {
        return $this->name;
    }
}

