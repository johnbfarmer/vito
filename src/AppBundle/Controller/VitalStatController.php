<?php

namespace AppBundle\Controller;

use AppBundle\Entity\VitalStat;
use AppBundle\Entity\Person;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Session\SessionInterface;

use AppBundle\Helper\GenericHelper;
use AppBundle\Helper\Tablifier;

/**
 * Vitalstat controller.
 *
 * @Route("vito")
 */
class VitalStatController extends Controller
{
    /**
     * Lists all vitalStat entities.
     *
     * @Route("/", name="vitalstat_index")
     * @Method("GET")
     */
    public function indexAction(SessionInterface $session)
    {
        $em = $this->getDoctrine()->getManager();

        $vitalStats = $em->getRepository('AppBundle:VitalStat')->findBy([], ['date' => 'desc'], 10);
        $vars = $this->commonVars($session);
        $vars['vitalStats'] = $vitalStats;

        // return $this->render('default/vito.html.twig', $vars);
        return $this->render('vitalstat/index.html.twig', $vars);
    }

    /**
     * @Route("/person/{id}", name="vitalstat_index_by_person")
     * @Method("GET")
     */
    public function indexByPersonAction(Person $person, SessionInterface $session)
    {
        $personId = $person->getId();
        return $this->redirectToRoute('vitalstat_index_by_person_and_month', ['id' => $personId, 'yearMonth' => date('Ym')]);
        $em = $this->getDoctrine()->getManager();
        $vitalStats = $em->getRepository('AppBundle:VitalStat')->findBy(['personId' => $person->getId()], ['date' => 'desc']);
        $vars = $this->commonVars($session, $personId);
        $vars['vitalStats'] = $vitalStats;

        return $this->render('vitalstat/index.html.twig', $vars);
    }

    /**
     * @Route("/person/{id}/{yearMonth}", name="vitalstat_index_by_person_and_month",requirements={"yearMonth"="\d{6}"})
     * @Method("GET")
     */
    public function indexByPersonAndMonthAction(Person $person, $yearMonth, SessionInterface $session) // YYYYMM
    {
        if (!$yearMonth) {
            $yearMonth = date('Ym');
        }

        $personId = $person->getId();
        $y = substr($yearMonth, 0, 4);
        $m = substr($yearMonth, 4, 2);
        $first = $y . '-' . $m . '-01';
        $prevMonth = date('Ym', strtotime($first . '- 1 day'));
        $nextMonth = date('Ym', strtotime($first . '+ 31 day'));

        $em = $this->getDoctrine()->getManager();
        $vitalStats = $em->getRepository('AppBundle:VitalStat')->findByPersonAndMonth($person->getId(), $yearMonth);
        $vars = $this->commonVars($session, $personId);
        $vars['vitalStats'] = $vitalStats;
        $vars['prevMonth'] = $prevMonth;
        $vars['nextMonth'] = $nextMonth;

        return $this->render('vitalstat/index.html.twig', $vars);
    }

    /**
     * Creates a new vitalStat entity.
     *
     * @Route("/new/{personId}", name="vitalstat_new")
     * @Method({"GET", "POST"})
     */
    public function newAction(Request $request, $personId)
    {
        $vitalStat = new Vitalstat();
        $vitalStat->setDate(new \DateTime());
        if (!$personId) {
            $personId = 1;
        }
        $em = $this->getDoctrine()->getManager();
        $person = $em->getRepository('AppBundle:Person')->find($personId);
        $vitalStat->setPerson($person);
        $vars = ['personId' => $personId];
        $form = $this->createForm('AppBundle\Form\VitalStatType', $vitalStat, ['action' => $this->generateUrl('vitalstat_new', $vars)]);
        $form->handleRequest($request);
        $vars['vitalStat'] = $vitalStat;
        $vars['form'] = $form->createView();

        // if ($form->isSubmitted() && $form->isValid()) {
        if ($form->isSubmitted()) {
            $em = $this->getDoctrine()->getManager();
            $em->persist($vitalStat);
            $em->flush();

            return $this->redirectToRoute('vito', []);
            // return $this->redirectToRoute('vitalstat_edit', array('id' => $vitalStat->getId()));
        }

        // return $this->render('vitalstat/new.html.twig', $vars);
        return $this->render('vitalstat/new_component.html.twig', $vars);
    }

    /**
     * Displays a form to edit an existing vitalStat entity.
     *
     * @Route("/{id}/edit", name="vitalstat_edit")
     * @Method({"GET", "POST"})
     */
    public function editAction(Request $request, VitalStat $vitalStat, SessionInterface $session)
    {
        $deleteForm = $this->createDeleteForm($vitalStat);
        $editForm = $this->createForm(
            'AppBundle\Form\VitalStatType',
            $vitalStat,
            ['action' => $this->generateUrl('vitalstat_edit', ['id' => $vitalStat->getId()])]
        );
        $editForm->handleRequest($request);
        $vars = $this->commonVars($session);
        $vars['vitalStat'] = $vitalStat;
        $vars['edit_form'] = $editForm->createView();
        $vars['delete_form'] = $deleteForm->createView();

        // add back isValid when csrf issue is solved :(
        // if ($editForm->isSubmitted() && $editForm->isValid()) {
        if ($editForm->isSubmitted()) {
            $this->getDoctrine()->getManager()->flush();

            return $this->redirectToRoute('vito', []);
        }

        return $this->render('vitalstat/edit_component.html.twig', $vars);
    }

    /**
     * Displays a form to edit an existing vitalStat entity.
     *
     * @Route("/{personId}/{date}", name="vitalstat_edit_by_date_and_person",requirements={"personId"="\d+"})
     * @Method({"GET", "POST"})
     */
    public function editByDateAndPersonAction(Request $request, $date, $personId)
    {
        $em = $this->getDoctrine()->getManager();
        GenericHelper::log('jbf2');
        if ($request->request->has('stepsPerKm')) {
            $request->request->remove('stepsPerKm');
        }
        $dateObj = new \DateTime($date);
        $vitalStat = $em->getRepository('AppBundle:VitalStat')->findOneBy(['date' => $dateObj, 'personId' => $personId]);
        // tbi handle empty
        $deleteForm = $this->createDeleteForm($vitalStat);
        $editForm = $this->createForm('AppBundle\Form\VitalStatType', $vitalStat);
        $editForm->handleRequest($request);

        if ($editForm->isSubmitted() && $editForm->isValid()) {
            $this->getDoctrine()->getManager()->flush();

            return $this->redirectToRoute('vitalstat_edit', array('id' => $vitalStat->getId()));
        }

        return $this->render('vitalstat/edit_component.html.twig', array(
            'vitalStat' => $vitalStat,
            'edit_form' => $editForm->createView(),
            'delete_form' => $deleteForm->createView(),
        ));
    }

    /**
     * Yearly summary.
     *
     * @Route("/person/{id}/summary/{year}", name="vitalstat_year")
     * @Method("GET")
     */
    public function yearlySummaryAction(Person $person, $year, SessionInterface $session)
    {
        $em = $this->getDoctrine()->getManager();
        $personId = $person->getId();
        $vitalStats = $em->getRepository('AppBundle:VitalStat')->yearlySummary($personId, $year);
        $fields = $person->getFields();
        $columnHeaders = GenericHelper::getColumnHeaders($fields);
        if (!empty($fields)) {
            $fields[] = 'date';
            $fields[] = 'ym';
            foreach ($vitalStats as $idx => $record) {
                foreach (array_keys($record) as $key) {
                    if (!in_array($key, $fields)) {
                        unset($vitalStats[$idx][$key]);
                    }
                }
            }
        }
        $vars = $this->commonVars($session, $personId);
        $vars['vitalStats'] = $vitalStats;
        $vars['columnHeaders'] = $columnHeaders;
        $otherYears = $em->getRepository('AppBundle:VitalStat')->availableYears($personId, $year);
        $vars['otherYears'] = [];
        foreach($otherYears as $record) {
            $vars['otherYears'][] = $record['year'];
        }

        return $this->render('vitalstat/yearly_summary.html.twig', $vars);
    }

    /**
     * Deletes a vitalStat entity.
     *
     * @Route("/{id}", name="vitalstat_delete")
     * @Method("DELETE")
     */
    public function deleteAction(Request $request, VitalStat $vitalStat)
    {
        $form = $this->createDeleteForm($vitalStat);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $em = $this->getDoctrine()->getManager();
            $em->remove($vitalStat);
            $em->flush();
        }

        return $this->redirectToRoute('vitalstat_index');
    }

    protected function commonVars($session, $personId = null)
    {
        if ($personId) {
            $session->set('person_id', $personId);
        } else {
            $personId = $session->get('person_id') ?: 1;
        }
        // $this->$container->set('session')->set('person_id', $personId);
        return [
            'personId' => $personId,
        ];
    }

    private function createDeleteForm(VitalStat $vitalStat)
    {
        return $this->createFormBuilder()
            ->setAction($this->generateUrl('vitalstat_delete', array('id' => $vitalStat->getId())))
            ->setMethod('DELETE')
            ->getForm()
        ;
    }

    /**
     * @Route("/recent/{personId}", name="recent")
     * @Method("GET")
     */
    public function recentAction($personId)
    {
        $em = $this->getDoctrine()->getManager();
        $vitalStats = $em->getRepository('AppBundle:VitalStat')->recent($personId, 10);
        $fields = $personId ? $em->getRepository('AppBundle:Person')->find($personId)->getFields() : null;
        $tablifier = Tablifier::tablify($vitalStats, $fields, []);
        return new JsonResponse($tablifier->getTable());
    }

    /**
     * @Route("/{personId}/{agg}/{numUnits}", name="summary", requirements={"agg"="years|months|days|weeks"})
     * @Method("GET")
     */
    public function summaryAction(Request $request, $agg, $personId, $numUnits)
    {
        $statRepo = $this->getDoctrine()->getManager()->getRepository('AppBundle:VitalStat');
        $personRepo = $this->getDoctrine()->getManager()->getRepository('AppBundle:Person');
        $dateStart = $request->query->has('dateStart') ? $request->query->get('dateStart') : null;
        $dateEnd = $request->query->has('dateEnd') ? $request->query->get('dateEnd') : null;
        $dates = [
            'start' => $dateStart,
            'end' => $dateEnd,
        ];

        switch ($agg) {
            case 'years':
                $vitalStats = $statRepo->yearlySummary($personId, 'years', $numUnits, $dates);
                break;
            case 'months':
                $vitalStats = $statRepo->yearlySummary($personId, 'months', $numUnits, $dates);
                break;
            case 'weeks':
                $vitalStats = $statRepo->yearlySummary($personId, 'weeks', $numUnits, $dates);
                break;
            case 'days':
                if (!$request->query->has('dateRangeId')) {
                    $vitalStats = $statRepo->yearlySummary($personId, 'days', $numUnits, $dates);
                } else {
                    $dateRangeType = $request->query->get('dateRangeType');
                    $dateRangeId = $request->query->get('dateRangeId');
                    $dates = $dateRangeType === 'ym' ? GenericHelper::yearMonthEndpoints($dateRangeId) : GenericHelper::yearWeekEndpoints($dateRangeId);
                    $vitalStats = $statRepo->days($personId, $dates['start'], $dates['end']);
                }
        }

        $fields = $personId ? $personRepo->find($personId)->getFields() : null;
        $total = $records['total'] = $statRepo->summaryTotal($personId, $agg, $numUnits, $dates);
        $tablifier = Tablifier::tablify($vitalStats, $fields, $total);
        return new JsonResponse($tablifier->getTable());
    }
}
