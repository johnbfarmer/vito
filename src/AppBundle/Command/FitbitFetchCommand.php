<?php

namespace AppBundle\Command;

use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Bundle\FrameworkBundle\Command\ContainerAwareCommand;

use AppBundle\Vito\FitbitFetch;

class FitbitFetchCommand extends ContainerAwareCommand
{
    protected 
        $config,
        $connection,
        $parameters;

    protected function configure()
    {
        $this->setName('vito:fitbit-fetch')
            ->setDescription('query the api and import')
            ->setHelp('tbi')
            ->addArgument('date', InputArgument::OPTIONAL, '')
            ->addOption('days', 'd', InputOption::VALUE_REQUIRED, 'number of days to go back', 1)
            ->addOption('update-db', 'u', InputOption::VALUE_REQUIRED, 'update the db (or store only)', 1)
            ->addOption('personId', 'p', InputOption::VALUE_REQUIRED, 'dbid of the person (default is 1)', 1);
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $output->writeln('FITBIT FETCH');
        $this->parameters = array_merge($input->getArguments(), $input->getOptions());
        $connection = $this->getContainer()->get('doctrine')->getConnection();
        $this->parameters['connection'] = $connection;
        $this->parameters['output'] = $output;
        if (empty($this->parameters['date'])) {
            $this->parameters['date'] = date('Y-m-d', strtotime('yesterday'));
        }
        FitbitFetch::autoExecute($this->parameters);
    }
}
