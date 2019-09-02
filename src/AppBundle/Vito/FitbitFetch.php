<?php 

namespace AppBundle\Vito;

use AppBundle\Helper\GenericHelper;

class FitbitFetch extends BaseProcess
{
    protected
        $personId = 1, // tbi get from command params
        $date,
        $storeOnly = false,
        $token,
        $data,
        $secretsFile;

    public function execute()
    {
        $date = $this->parameters['date'];
        $days = $this->parameters['days'];
        $this->storeOnly = $this->parameters['update-db'] == 0;
        $this->personId = $this->parameters['personId'];
        while (--$days >= 0) {
            $this->token = $this->getToken();
            try {
                $this->output->writeln('fetching data...');
                $this->data = $this->getData($date);
            } catch(\Exception $e) {
                $this->token = $this->getNewToken();
                if (empty($this->token)) {
                    throw new \Exception('refresh token failed. visit dev.fitbit.com');
                }
                $this->data = $this->getData($date);
            }

            if (!$this->storeOnly) {
                $this->insertData($date);
            }
            $date = date('Y-m-d', strtotime($date . ' - 1 days'));
        }
    }

    protected function saveData($data, $date)
    {
        $file = 'data' . DIRECTORY_SEPARATOR . str_replace('-', '', $date);
        try {
            file_put_contents($file, json_encode($data));
        } catch(\Exception $e) {
            throw new \Exception('failed to write to ' . $file);
        }
    }

    protected function insertData($date)
    {
        $this->output->writeln('inserting data...');
        if (empty($this->data)) {
            return;
        }

        $this->performDataInsert($date);
    }

    protected function performDataInsert($date)
    {
        $insert = '';
        $values = [
            '"' . $date . '"',
            $this->personId,
            $this->data['steps'],
            $this->data['distance'],
            $this->data['sleep'],
            $this->data['floors'],
            $this->data['veryActiveMinutes'],
        ];

        $insert .= '
        (' . implode(',', $values) . '),';

        $insert = rtrim($insert, ",");
        if (empty($insert)) {
            return;
        }

        $connection = $this->parameters['connection'];

        $sql = '
        INSERT INTO vital_stats
        (`date`, `person_id`, `steps`, `distance`, `sleep`, `floors`, `very_active_minutes`)
        VALUES ' . $insert . '
        ON DUPLICATE KEY UPDATE 
        `steps` = VALUES(`steps`),
        `distance` = VALUES(`distance`),
        `floors` = VALUES(`floors`),
        `very_active_minutes` = VALUES(`very_active_minutes`),
        `sleep` = VALUES(`sleep`)';

        $connection->exec($sql);
    }

    protected function getData($date)
    {
        $data = $this->getActivitiesData($date);
        $data['sleep'] = $this->getSleepData($date);
        return $data;
    }

    protected function getActivitiesData($date)
    {
        $result = $this->curl('activities', $date);
        $activities = $result;
        if (empty($activities['summary'])) {
            throw new \Exception('Summary is empty.');
        }
        $this->saveData($activities, $date);
        return [
            'steps' => $activities['summary']['steps'],
            'floors' => $activities['summary']['floors'],
            'veryActiveMinutes' => $activities['summary']['veryActiveMinutes'],
            'distance' => $activities['summary']['distances'][0]['distance'], // improve, unsafe relying on position
        ];
    }

    protected function getSleepData($date)
    {
        $result = $this->curl('sleep', $date);
        $sleep = $result;
        $totalMinutesAsleep = $sleep['summary']['totalMinutesAsleep'];
        return $totalMinutesAsleep > 90 ? $totalMinutesAsleep : 'null';
    }

    protected function curl($type, $date)
    {
        // type is activities or sleep
        $ch = curl_init();
        $headers = [
            'Authorization: Bearer ' . $this->token,
        ];
        $uri = 'https://api.fitbit.com/1/user/-/' . $type . '/date/' . $date . '.json';
        curl_setopt($ch, CURLOPT_URL, $uri);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, false);
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers); 
        
        $resultString = curl_exec($ch);
        $result = json_decode($resultString, true);
        $status_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close ($ch);
        if (isset($result['success']) && $result['success'] == false) {
            throw new \Exception('getting new token');
        }

        return $result;
    }

    protected function getToken()
    {
        $sql = 'SELECT access_token from people where id = ' . $this->personId;

        $result = $this->fetch($sql);
        return $result['access_token'];
    }

    protected function updateTokens($tokens)
    {
        $sql = 'UPDATE people SET access_token = "' . $tokens['access_token'] . '", refresh_token = "' . $tokens['refresh_token'] . '" where id = ' . $this->personId;

        $result = $this->exec($sql);
        $this->output->writeln('tokens updated');
    }

    protected function getNewToken()
    {
        $sql = 'SELECT refresh_token from people where id = ' . $this->personId;

        $result = $this->fetch($sql);
        $refreshToken = $result['refresh_token'];
        $ch = curl_init();
        $query = http_build_query([
            'grant_type' => 'refresh_token',
            'refresh_token' => $refreshToken,
        ]);
        $headers = [
            'Authorization: Basic MjJDVlMzOmU0NjNmYWM2ZTdhYTIxZjc1ZjdjM2M2NDkzZWZlMWRl',
            'Content-Type: application/x-www-form-urlencoded',
        ];
        $uri = 'https://api.fitbit.com/oauth2/token';
        curl_setopt($ch, CURLOPT_URL, $uri);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'POST');
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $query);
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers); 
        
        $resultString = curl_exec($ch);
        $result = json_decode($resultString, true);
        $status_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close ($ch);

        $accessToken = !empty($result['access_token']) ? $result['access_token'] : null;

        if (!empty($accessToken)) {
            $this->updateTokens($result);
        }

        return $accessToken;
    }
}
