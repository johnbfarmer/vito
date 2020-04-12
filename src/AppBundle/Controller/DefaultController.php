<?php

namespace AppBundle\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;

class DefaultController extends Controller
{
    /**
     * @Route("/", name="vito")
     */
    public function indexAction(Request $request)
    {
        return $this->render('default/vito.html.twig', [
            'base_dir' => realpath($this->getParameter('kernel.project_dir')).DIRECTORY_SEPARATOR,
        ]);
    }

    /**
     * @Route("/{agg}/{numUnits}/{endDate}", name="summary_view_with_end", requirements={"agg"="years|months|days|weeks"})
     */
    public function summaryWithEndAction(Request $request)
    {
        return $this->render('default/vito.html.twig', [
            'base_dir' => realpath($this->getParameter('kernel.project_dir')).DIRECTORY_SEPARATOR,
        ]);
    }

    /**
     * @Route("/{unitType}/{unit}/{agg}", name="summary_breakdown", requirements={"agg"="years|months|days|weeks"})
     */
    public function summaryBreakdownAction(Request $request)
    {
        return $this->render('default/vito.html.twig', [
            'base_dir' => realpath($this->getParameter('kernel.project_dir')).DIRECTORY_SEPARATOR,
        ]);
    }

    /**
     * @Route("/{agg}/{numUnits}", name="summary_view", requirements={"agg"="years|months|days|weeks"})
     */
    public function summaryAction(Request $request)
    {
        return $this->render('default/vito.html.twig', [
            'base_dir' => realpath($this->getParameter('kernel.project_dir')).DIRECTORY_SEPARATOR,
        ]);
    }

    /**
     * @Route("/test", name="homepage")
     */
    public function originalIndexAction(Request $request)
    {
        // replace this example code with whatever you need
        return $this->render('default/index.html.twig', [
            'base_dir' => realpath($this->getParameter('kernel.project_dir')).DIRECTORY_SEPARATOR,
        ]);
    }
}
