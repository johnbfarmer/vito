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
        $session = $request->getSession();
        $vars = $this->commonVars($session);
        return $this->render('default/vito.html.twig', [
            'base_dir' => realpath($this->getParameter('kernel.project_dir')).DIRECTORY_SEPARATOR,
            'dataModel' => $vars,
        ]);
    }

    /**
     * @Route("/{agg}/{numUnits}/{endDate}", name="summary_view_with_end", requirements={"agg"="years|months|days|weeks"})
     */
    public function summaryWithEndAction(Request $request)
    {
        $session = $request->getSession();
        $vars = $this->commonVars($session);
        return $this->render('default/vito.html.twig', [
            'base_dir' => realpath($this->getParameter('kernel.project_dir')).DIRECTORY_SEPARATOR,
            'dataModel' => $vars,
        ]);
    }

    /**
     * @Route("/{agg}/{numUnits}", name="summary_view", requirements={"agg"="years|months|days|weeks"})
     */
    public function summaryAction(Request $request)
    {
        $session = $request->getSession();
        $vars = $this->commonVars($session);
        return $this->render('default/vito.html.twig', [
            'base_dir' => realpath($this->getParameter('kernel.project_dir')).DIRECTORY_SEPARATOR,
            'dataModel' => $vars,
        ]);
    }

    protected function commonVars($session, $personId = null)
    {
        if ($personId) {
            $session->set('person_id', $personId);
        } else {
            $personId = $session->get('person_id') ?: 1;
        }

        return [
            'personId' => $session->get('person_id') ?: 1,
            'chartType' => $session->get('chart_type') ?: '',
            'chartSelectedMetrics' => $session->get('chart_selected_metrics') ?: ['distance_run'],
        ];
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
