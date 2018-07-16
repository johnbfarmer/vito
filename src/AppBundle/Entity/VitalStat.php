<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * VitalStat
 *
 * @ORM\Table(name="vital_stats")
 * @ORM\Entity(repositoryClass="AppBundle\Repository\VitalStatRepository")
 */
class VitalStat
{
    /**
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @ORM\Column(name="date", type="date")
     */
    private $date;

    /**
     * @ORM\Column(name="person_id", type="integer")
     */
    private $personId;

    /**
     * @ORM\Column(name="distance", type="decimal", precision=2, scale=5, nullable=false, options={"default" = 0.00})
     */
    private $distance = 0.00;

    /**
     * @ORM\Column(name="distance_run", type="decimal", precision=1, scale=5, nullable=false, options={"default" = 0.0})
     */
    private $distanceRun = 0.0;

    /**
     * @ORM\Column(name="steps", type="integer", nullable=false, options={"default" = 0})
     */
    private $steps = 0;

    /**
     * @ORM\Column(name="sleep", type="integer", nullable=true)
     */
    private $sleep;

    /**
     * @ORM\Column(name="weight", type="decimal", precision=1, scale=5, nullable=true)
     */
    private $weight;

    /**
     * @ORM\Column(name="abdominals", type="decimal", precision=1, scale=5, nullable=false, options={"default" = 0.0})
     */
    private $abdominals = 0.0;

    /**
     * @ORM\Column(name="systolic", type="integer", nullable=true)
     */
    private $systolic;

    /**
     * @ORM\Column(name="diastolic", type="integer", nullable=true)
     */
    private $diastolic;

    /**
     * @ORM\Column(name="pulse", type="integer", nullable=true)
     */
    private $pulse;

    /**
     * @ORM\Column(name="alcohol", type="decimal", precision=1, scale=3, nullable=true)
     */
    private $alcohol;

    /**
     * @ORM\Column(name="tobacco", type="decimal", precision=1, scale=3, nullable=true)
     */
    private $tobacco;

    /**
     * @ORM\Column(name="comments", type="text", nullable=true)
     */
    private $comments;

    /**
     * @ORM\ManyToOne(targetEntity="Person", inversedBy="vitalStats")
     * @ORM\JoinColumn(name="person_id", referencedColumnName="id")
     */
    private $person;


    public function getId()
    {
        return $this->id;
    }

    public function setDate($date)
    {
        $this->date = $date;

        return $this;
    }

    public function getDate()
    {
        return $this->date;
    }

    public function setPersonId($personId)
    {
        $this->personId = $personId;

        return $this;
    }

    public function getPersonId()
    {
        return $this->personId;
    }

    public function setDistance($distance)
    {
        $this->distance = $distance;

        return $this;
    }

    public function getDistance()
    {
        return $this->distance;
    }

    public function setDistanceRun($distanceRun)
    {
        $this->distanceRun = $distanceRun;

        return $this;
    }

    public function getDistanceRun()
    {
        return $this->distanceRun;
    }

    public function setSteps($steps)
    {
        $this->steps = $steps;

        return $this;
    }

    public function getSteps()
    {
        return $this->steps;
    }

    public function setSleep($sleep)
    {
        $this->sleep = $sleep;

        return $this;
    }

    public function getSleep()
    {
        return $this->sleep;
    }

    public function setWeight($weight)
    {
        $this->weight = $weight;

        return $this;
    }

    public function getWeight()
    {
        return $this->weight;
    }

    public function setAbdominals($abdominals)
    {
        $this->abdominals = $abdominals;

        return $this;
    }

    public function getAbdominals()
    {
        return $this->abdominals;
    }

    public function setSystolic($systolic)
    {
        $this->systolic = $systolic;

        return $this;
    }

    public function getSystolic()
    {
        return $this->systolic;
    }

    public function setDiastolic($diastolic)
    {
        $this->diastolic = $diastolic;

        return $this;
    }

    public function getPulse()
    {
        return $this->pulse;
    }

    public function setPulse($pulse)
    {
        $this->pulse = $pulse;

        return $this;
    }

    public function getAlcohol()
    {
        return $this->alcohol;
    }

    public function setAlcohol($alcohol)
    {
        $this->alcohol = $alcohol;

        return $this;
    }

    public function getTobacco()
    {
        return $this->tobacco;
    }

    public function setTobacco($tobacco)
    {
        $this->tobacco = $tobacco;

        return $this;
    }

    public function getDiastolic()
    {
        return $this->diastolic;
    }

    public function setComments($comments)
    {
        $this->comments = $comments;

        return $this;
    }

    public function getComments()
    {
        return $this->comments;
    }

    public function setPerson($person)
    {
        $this->person = $person;

        return $this;
    }

    public function getPerson()
    {
        return $this->person;
    }

    public function stepsPerKm()
    {
        return $this->distance > 0 ? round($this->steps / $this->distance, 2) : 0;
    }

    public function getBp()
    {
        if (empty($this->systolic)) {
            return '';
        }

        return $this->systolic . '/' . $this->diastolic;
    }

    public function setBp($bp)
    {
        if (empty($bp)) {
            $this->systolic = null;
            $this->diastolic = null;
        } else {
            $parts = explode('/', $bp);
            $this->systolic = $parts[0];
            $this->diastolic = $parts[1];
        }

        return $this;
    }
}

