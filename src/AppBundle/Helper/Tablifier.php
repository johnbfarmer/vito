<?php

namespace AppBundle\Helper;

class Tablifier
{
    protected
        $data = [],
        $cols = [],
        $rows = [],
        $total = [],
        $colConfig = [],
        $hiddenCols = ['iso_date', 'id'],
        $table = [];

    public function __construct($data, $limitCols, $total)
    {
        $this->data = $data;
        $this->total = $total;
        $this->colConfig = $this->getColConfig();
        $this->getLimitedCols($limitCols);
    }

    protected function execute() 
    {
        $cols = $this->getCols();
        $rows = $this->getRows();
        $this->table = [
            'table' => [
                'columns' => $this->cols,
                'rows' => $this->rows,
                'total' => $this->total,
            ]
        ];
    }

    protected function getCols()
    {
        $cols = [];

        if (!empty($this->data)) {
            foreach (current($this->data) as $uid => $item) {
                if (empty($this->colConfig[$uid])) {
                    continue;
                }
                $cols[$uid] = [
                    'uid' => $uid,
                    'label' => $this->colConfig[$uid],
                    'visible' => !in_array($uid, $this->hiddenCols),
                ];
            }

            foreach (array_keys($this->colConfig) as $uid) {
                if (!empty($cols[$uid])) {
                    $this->cols[] = $cols[$uid];
                }
            }
        }
    }

    protected function getRows()
    {
        if (!empty($this->data)) {
            foreach ($this->data as $rows) {
                $row = [];
                foreach ($rows as $uid => $item) {
                    if (empty($this->colConfig[$uid])) {
                        continue;
                    }
                    $row[$uid] = $item;
                }
                $this->rows[] = $row;
            }
        }
    } 

    public static function tablify($vars, $limitCols, $total) 
    {
        $className = get_called_class();
        $class = new $className($vars, $limitCols, $total);
        $class->execute();
        return $class;
    }

    protected function getLimitedCols($userCols)
    {
        if (!empty($userCols)) {
            $dimensions = ['date', 'iso_date', 'id'];
            $userCols = array_unique(array_merge($dimensions, $userCols));
            $tempCols = [];
            foreach ($this->colConfig as $uid => $item) {
                if (in_array($uid, $userCols)) {
                    $tempCols[$uid] = $item;
                }
            }

            $this->colConfig = $tempCols;
        }
    }

    // define ordering, inclusion and labels
    protected function getColConfig()
    {
        return [
            'date' => 'Date',
            'iso_date' => 'iso_date',
            'id' => 'id',
            'name' => 'Name',
            'distance' => 'Distance',
            'distance_run' => 'Distance Run',
            'steps' => 'Steps',
            'stepsPerKm' => 'Steps/Km',
            'sleep' => 'Sleep',
            'weight' => 'Weight',
            'abdominals' => 'Abdominals',
            // 'systolic' => 'Systolic',
            // 'diastolic' => 'Diastolic',
            'bp' => 'Blood Pressure',
            'pulse' => 'Pulse',
            'za' => 'ZA',
            // 'alcohol' => 'Alcohol',
            // 'tobacco' => 'Tobacco',
            // 'comments' => 'Comments',
        ];
    }

    public function getTable() 
    {
        return $this->table;
    }
}
