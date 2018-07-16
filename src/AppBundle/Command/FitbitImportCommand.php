<?php

namespace AppBundle\Command;

use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Bundle\FrameworkBundle\Command\ContainerAwareCommand;

use AppBundle\Vito\FitbitImport;

class FitbitImportCommand extends ContainerAwareCommand
{
    protected 
        $config,
        $connection,
        $parameters;

    protected function configure()
    {
        $this->setName('vito:fitbit-import')
            ->setDescription('read a csv')
            ->setHelp('tbi')
            ->addArgument(
                'file', InputArgument::REQUIRED, 'The name of the file'
            );
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $output->writeln('RUNNING');
        $this->parameters = array_merge($input->getArguments(), $input->getOptions());
        $connection = $this->getContainer()->get('doctrine')->getConnection();
        $this->parameters['connection'] = $connection;
        FitbitImport::autoExecute($this->parameters);
    }
}
