<?php

namespace AppBundle\Helper;

class GenericHelper
{
    public static 
        $logger;

    public function __construct($logger)
    {
        self::$logger = $logger;
    }

    public function onKernelRequest($event)
    {
        return;
    }

    public function onConsoleCommand($event)
    {
        return;
    }

    public static function getColumnHeaders($fields)
    {
        $allFields = [
            'run' => 'Run',
            'distance' => 'Distance',
            'steps' => 'Steps',
            'avg_steps' => 'Steps/Km',
            'abdominals' => 'Abdominals',
            'weight' => 'Weight',
            'sleep' => 'Sleep',
            'za' => 'ZA',
            // 'alcohol' => 'Alcohol',
            // 'tobacco' => 'Tobacco',
            'bp' => 'BP',
            'pulse' => 'Pulse',
            'floors' => 'Floors',
            'floors_run' => 'Floors Run',
            'very_active_minutes' => 'Very Active Minutes',
            'distance_biked' => 'Distance Biked',
            'minutes_biked' => 'Minutes Biked',
            'swim' => 'Swim',
        ];

        if (empty($fields)) {
            return $allFields;
        }

        $labels = [];
        foreach ($fields as $field) {
            $labels[$field] = $allFields[$field];
        }

        return $labels;
    }

    public static function yearMonthEndpoints($ym)
    {
        $start = substr($ym, 0, 4) . '-' . substr($ym, 4, 2) . '-01';
        $end = date('Y-m-t', strtotime($start));
        return ['start' => $start, 'end' => $end];
    }

    public static function yearWeekEndpoints($yw)
    {
        $result = [];
        $year = substr($yw, 0, 4);
        $week = substr($yw, 4, 2);
        $datetime = new \DateTime($year . '-02-01'); // random day in year
        $datetime->setISODate((int)$datetime->format('o'), $week, 1);
        $interval = new \DateInterval('P1D');
        $week = new \DatePeriod($datetime, $interval, 6);

        foreach($week as $day){
            $result[] = $day->format('Y-m-d');
        }

        return ['start' => $result[0], 'end' => $result[6]];
    }

    public static function log($str, $level = 'notice')
    {
        if (!is_string($str)) {
            $str = print_r($str, TRUE);
        }

        $accepted_levels = array(
            'emergency',
            'alert',
            'critical',
            'warning',
            'notice',
            'info',
            'debug'
        );

        if (!in_array($level, $accepted_levels)) {
            $level = 'info';
        }

        self::$logger->$level($str);
    }

    public static function getLogger()
    {
        return self::$logger;
    }

    public static function snakify($word)
    {
        preg_match_all('!([A-Z][A-Z0-9]*(?=$|[A-Z][a-z0-9])|[A-Za-z][a-z0-9]+)!', $word, $matches);
        $ret = $matches[0];
        foreach ($ret as &$match) {
            $match = $match == strtoupper($match) ? strtolower($match) : lcfirst($match);
        }
        return implode('_', $ret);
    }

    public static function wordify($word)
    {
        $snakified = self::snakify($word);
        return str_replace('_', ' ', $snakified);
    }
}
