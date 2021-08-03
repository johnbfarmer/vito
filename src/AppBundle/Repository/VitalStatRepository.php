<?php

namespace AppBundle\Repository;

use Doctrine\Common\Collections\ArrayCollection;

class VitalStatRepository extends \Doctrine\ORM\EntityRepository
{
    public function findByPersonAndMonth($personId, $yearMonth = null)
    {
        if (!$personId) {
            return new ArrayCollection();
        }

        if (!$yearMonth) {
            $yearMonth = date('Ym');
        }

        $year = substr($yearMonth, 0, 4);
        $month = substr($yearMonth, 4, 2);
        $startDate = $year . '-' . $month . '-01';
        $stopDate = date('Y-m-t', strtotime($startDate));

        $em = $this->getEntityManager();
        $qb = $em->createQueryBuilder();
        $qb->select('v')
            ->from('AppBundle:VitalStat', 'v')
            ->innerJoin('v.person', 'p')
            ->where('p.id = :personId')
            ->andWhere('v.date BETWEEN :startDate AND :stopDate')
            ->orderBy('v.date', 'DESC')
            ->setParameter(':personId', $personId)
            ->setParameter('startDate', $startDate)
            ->setParameter('stopDate',  $stopDate)
        ;

        $q = $qb->getQuery();
        $results = $q->getResult();
        return $results;
    }

    public function days($personId, $startDate, $endDate)
    {
        $sql = '
        SELECT 
            v.id,
            distance_run,
            distance,
            sleep,
            steps,
            IFNULL(steps - 230 * `distance_biked` / distance, 0) AS stepsPerKm,
            alcohol,
            za,
            tobacco,
            pulse,
            weight,
            floors,
            floors_run,
            very_active_minutes,
            distance_biked,
            minutes_biked,
            swim,
            CONCAT(systolic, "/", diastolic) AS bp,
            comments,
            abdominals,
            score,
            `date`,
            `date` AS iso_date
        FROM vital_stats v
        INNER JOIN people p ON v.person_id = p.id
        WHERE p.id = :personId
        AND v.date BETWEEN :startDate AND :endDate';

        $sql .= '
        ORDER BY v.date DESC
        LIMIT 100;';
        $conn = $this->getEntityManager()->getConnection();
        $stmt = $conn->prepare($sql);
        $stmt->bindValue(':personId', $personId, \PDO::PARAM_STR);
        $stmt->bindValue(':startDate', $startDate, \PDO::PARAM_STR);
        $stmt->bindValue(':endDate', $endDate, \PDO::PARAM_STR);
        $stmt->execute();
        $records = $stmt->fetchAll();
        return $records;
    }

    public function yearlySummary($personId, $agg, $limit = 50, $dates = [])
    {
        $dt = $agg === 'months' ? 'CONCAT(MONTHNAME(v.date), ", ", YEAR(v.date))' : 'YEARWEEK(v.date, 3)';
        $key = $agg === 'months' ? 'CONCAT(YEAR(v.date), LPAD(MONTH(v.date),2,0))' : 'YEARWEEK(v.date, 3)';
        $id = $agg === 'months' ? 'CONCAT("ym_", YEAR(v.date), LPAD(MONTH(v.date),2,0))' : 'CONCAT("yw_", YEARWEEK(v.date, 3))';
        if ($agg === 'days') {
            $dt = 'v.date';
            $key = 'v.date';
            $id = 'v.id';
        }
        if ($agg === 'years') {
            $dt = 'YEAR(v.date)';
            $key = 'YEAR(v.date)';
            $id = 'YEAR(v.date)';
        }

        $sql = $this->summaryQuery($agg, $limit, $dates);
        $conn = $this->getEntityManager()->getConnection();
        $stmt = $conn->prepare($sql);
        $stmt->bindValue(':personId', $personId, \PDO::PARAM_STR);
        $stmt->execute();
        $records = $stmt->fetchAll();

        return $records;
    }

    protected function getSummaryQueryPartsByAgg($agg)
    {
        $dt = $agg === 'months' ? 'CONCAT(MONTHNAME(v.date), ", ", YEAR(v.date))' : 'YEARWEEK(v.date, 3)';
        $key = $agg === 'months' ? 'CONCAT(YEAR(v.date), LPAD(MONTH(v.date),2,0))' : 'YEARWEEK(v.date, 3)';
        $id = $agg === 'months' ? 'CONCAT("ym_", YEAR(v.date), LPAD(MONTH(v.date),2,0))' : 'CONCAT("yw_", YEARWEEK(v.date, 3))';
        if ($agg === 'days') {
            $dt = 'v.date';
            $key = 'v.date';
            $id = 'v.id';
        }
        if ($agg === 'years') {
            $dt = 'YEAR(v.date)';
            $key = 'YEAR(v.date)';
            $id = 'YEAR(v.date)';
        }

        return [$key, $dt, $id];
    }

    protected function summaryQuery($agg, $limit, $dates = []) {
        list($key, $dt, $id) = $this->getSummaryQueryPartsByAgg($agg);

        $sel = '
        SELECT 
            SUM(`distance_run`) AS distance_run,
            ROUND(SUM(`distance`), 1) AS distance,
            ROUND(AVG(`sleep`), 2) AS sleep,
            ROUND(SUM(`steps`)) AS steps,
            IFNULL(ROUND(SUM(`steps` - 230 * `distance_biked`)/SUM(`distance`), 2), 0) AS stepsPerKm,
            ROUND(AVG(`alcohol`),1) AS alcohol,
            ROUND(AVG(`za`),2) AS za,
            ROUND(AVG(`tobacco`),1) AS tobacco,
            ROUND(AVG(`pulse`)) AS pulse,
            ROUND(AVG(`weight`),1) AS weight,
            ROUND(SUM(`floors`)) AS floors,
            ROUND(SUM(`floors_run`)) AS floors_run,
            ROUND(SUM(`very_active_minutes`)) AS very_active_minutes,
            ROUND(SUM(`distance_biked`)) AS distance_biked,
            ROUND(SUM(`minutes_biked`)) AS minutes_biked,
            ROUND(SUM(`swim`)) AS swim,
            ROUND(AVG(`systolic`)) AS systolic,
            ROUND(AVG(`diastolic`)) AS diastolic,
            CONCAT(ROUND(AVG(`systolic`)),"/",ROUND(AVG(`diastolic`))) AS bp,
            ROUND(SUM(`abdominals`)) AS abdominals,
            ROUND(AVG(`score`)) AS score,
            ' . $dt . ' AS `date`,
            MIN(v.date) AS `iso_date`,
            CONCAT(YEAR(v.date), LPAD(MONTH(v.date),2,0)) as `ym`,
            ' . $id . ' AS `id`';

        if ($agg === 'days') {
            $sel = '
        SELECT 
            distance_run,
            distance,
            sleep,
            steps,
            IFNULL(ROUND((`steps` - 230 * `distance_biked`)/`distance`, 2), 0) AS stepsPerKm,
            alcohol,
            za,
            tobacco,
            pulse,
            weight,
            floors,
            floors_run,
            very_active_minutes,
            distance_biked,
            minutes_biked,
            swim,
            systolic,
            diastolic,
            CONCAT(`systolic`,"/",`diastolic`) AS bp,
            abdominals,
            score, 
            comments,
            ' . $dt . ' AS `date`,
            v.date AS `iso_date`,
            CONCAT(YEAR(v.date), LPAD(MONTH(v.date),2,0)) as `ym`,
            ' . $id . ' AS `id`';
        }

        $sql = $sel . '
        FROM vital_stats v
        INNER JOIN people p ON v.person_id = p.id
        WHERE p.id = :personId ';
        if (!empty($dates['start'])) {
            $sql .= '
            AND `date` BETWEEN "' . $dates['start'] . '" AND "' . $dates['end'] . '"';
        } elseif (!empty($dates['end'])) {
            $sql .= '
            AND `date` <= "' . $dates['end'] . '"';
        }

        $sql .= '
        GROUP BY ' . $key . '
        ORDER BY ' . $key . ' DESC';

        if (empty($dates['start'])) {
            $sql .= '
        LIMIT ' . $limit;
        }

        return $sql;
    }

    public function summaryTotal($personId, $agg, $limit, $dates = [])
    {
        
        $innerSql = $this->summaryQuery($agg, $limit, $dates);
        $sql = '
        SELECT 
            SUM(`distance_run`) AS distance_run,
            ROUND(SUM(`distance`), 1) AS distance,
            ROUND(AVG(`sleep`), 2) AS sleep,
            ROUND(SUM(`steps`)) AS steps,
            IFNULL(ROUND(SUM(`steps` - 230 * `distance_biked`)/SUM(`distance`), 2), 0) AS stepsPerKm,
            ROUND(AVG(`alcohol`),1) AS alcohol,
            ROUND(AVG(`za`),2) AS za,
            ROUND(AVG(`tobacco`),1) AS tobacco,
            ROUND(AVG(`pulse`)) AS pulse,
            ROUND(AVG(`weight`),1) AS weight,
            ROUND(SUM(`floors`)) AS floors,
            ROUND(SUM(`floors_run`)) AS floors_run,
            ROUND(SUM(`very_active_minutes`)) AS very_active_minutes,
            ROUND(SUM(`distance_biked`)) AS distance_biked,
            ROUND(SUM(`minutes_biked`)) AS minutes_biked,
            ROUND(SUM(`swim`)) AS swim,
            CONCAT(ROUND(AVG(`systolic`)),"/",ROUND(AVG(`diastolic`))) AS bp,
            ROUND(SUM(`abdominals`)) AS abdominals,
            ROUND(AVG(`score`)) AS score,
            "total" AS `date`,
            "total" AS `iso_date`,
            "total" AS `ym`,
            "total" AS `id`
        FROM (' . $innerSql . '
        ) T';
        $conn = $this->getEntityManager()->getConnection();
        $stmt = $conn->prepare($sql);
        $stmt->bindValue(':personId', $personId, \PDO::PARAM_STR);
        $stmt->execute();
        $records = $stmt->fetch();
        return $records;
    }

    public function recent($personId, $limit)
    {
        $where = $personId ? 'WHERE p.id = ' . $personId : '';
        $sql = '
        SELECT v.id,
            `date`,
            p.`name`,
            `distance`,
            `distance_run`,
            `steps`,
            `sleep`,
            `weight`,
            floors,
            floors_run,
            very_active_minutes,
            distance_biked,
            minutes_biked,
            swim,
            `abdominals`,
            CONCAT(`systolic`, "/",
            `diastolic`) AS `bp`,
            `pulse`,
            `alcohol`, 
            `za`,
            `tobacco`,
            `comments`
        FROM vital_stats v
        INNER JOIN people p ON v.person_id = p.id
        ' . $where . '
        ORDER BY v.date DESC
        LIMIT ' . $limit . ';';
        $conn = $this->getEntityManager()->getConnection();
        $stmt = $conn->prepare($sql);
        $stmt->execute();
        $records = $stmt->fetchAll();
        return $records;
    }

    public function availableYears($personId, $year)
    {
        $sql = '
        SELECT YEAR(v.date) AS year
        FROM vital_stats v
        INNER JOIN people p ON v.person_id = p.id
        WHERE p.id = :personId
        AND YEAR(v.date) != :year
        GROUP BY YEAR(v.date)
        ORDER BY YEAR(v.date);';
        $conn = $this->getEntityManager()->getConnection();
        $stmt = $conn->prepare($sql);
        $stmt->bindValue(':personId', $personId, \PDO::PARAM_STR);
        $stmt->bindValue(':year', $year, \PDO::PARAM_STR);
        $stmt->execute();
        $records = $stmt->fetchAll();
        return $records;
    }

    protected function whereDateRange($dates)
    {
        if (!empty($dates['start'])) {
            if (!empty($dates['end'])) {
                return '
        AND v.date BETWEEN "' . $dates['start'] . '" AND "' . $dates['end'] . '"';
            }
            return '
        AND v.date >= "' . $dates['start'] . '"';
        }

        if (!empty($dates['end'])) {
            return '
        AND v.date <= "' . $dates['end'] . '"';
        }

        return '';
    }
}
