<?php 

namespace AppBundle\Vito;

class FitbitImport extends BaseProcess
{
    protected
        $personId = 1; // tbi get from command params

    public function execute()
    {
        if (empty($this->parameters['file'])) {
            throw new \Exception(get_called_class() . ' missing parameter "file"');
        }
        $this->file = $this->parameters['file'];
        if (!file_exists($this->file)) {
            throw new \Exception(get_called_class() . ' file ' . $this->file . ' not found.');
        }

        $this->file_basename = pathinfo($this->file, PATHINFO_BASENAME);
        $this->readFile();
        $this->insertData();
    }

    protected function readFile()
    {
        $this->fp = fopen($this->file, "r");
        // $this->log("PROCESSING FILE " . $this->file, true);

        while (($entry = fgetcsv($this->fp, 0, ',', '"', '"')) !== false) {
            if (empty($entry[0])) {
                continue;
            }
            $firstWord = $entry[0];
            if ($firstWord === "Activities") {
                $this->readActivities();
            }
            if ($firstWord === "Sleep") {
                $this->readSleep();
            }
        }

        fclose($this->fp);
    }

    protected function readActivities()
    {
        while (($entry = fgetcsv($this->fp, 0, ',', '"', '"')) !== false) {
            if (empty($entry[0])) {
                return; //blank line -> u r done
            }
            $date = $entry[0];
            if (strtotime($date) === false) {
                continue;
            }

            $nf = new \NumberFormatter("en", \NumberFormatter::DECIMAL);
            $steps = $nf->parse($entry[2], \NumberFormatter::TYPE_INT32);
            $date = date('Ymd', strtotime($date));
            $this->data[$date] = [
                'steps' => $steps,
                'distance' => (float)$entry[3],
                'sleep' => 0,
            ];

            if (count($this->data) >= 50) {
                $this->insertData();
                $this->data = [];
            }
        }
    }

    protected function readSleep()
    {
        while (($entry = fgetcsv($this->fp, 0, ',', '"', '"')) !== false) {
            if (empty($entry[0])) {
                return; //blank line -> u r done
            }
            $date = $entry[1]; // end date
            if (strtotime($date) === false) {
                continue;
            }

            $date = date('Ymd', strtotime($date));
            if (empty($this->data[$date])) {
                $this->data[$date] = [
                    'steps' => 0,
                    'distance' => 0,
                    'sleep' => 0,
                ];
            }

            $this->data[$date]['sleep'] += (int)$entry[2];

            if (count($this->data) >= 50) {
                $this->insertData();
                $this->data = [];
            }
        }
    }

    protected function insertData()
    {
        if (empty($this->data)) {
var_dump('empty');
            return;
        }
// var_dump($this->data);
        $this->performDataInsert();
    }

    protected function performDataInsert()
    {
        $insert = '';
        foreach ($this->data as $date => $record) {
            $values = [
                $date,
                $this->personId,
                $record['steps'],
                $record['distance'],
                $record['sleep'],
            ];

            $insert .= '
        (' . implode(',', $values) . '),';
        }

        $insert = rtrim($insert, ",");
        if (empty($insert)) {
            return;
        }

        $connection = $this->parameters['connection'];

        $sql = '
        INSERT INTO vital_stats
        (`date`, `person_id`, `steps`, `distance`, `sleep`)
        VALUES ' . $insert . '
        ON DUPLICATE KEY UPDATE 
        `steps` = VALUES(`steps`),
        `distance` = VALUES(`distance`),
        `sleep` = VALUES(`sleep`)';

var_dump($sql);
        $connection->exec($sql);
    }
}