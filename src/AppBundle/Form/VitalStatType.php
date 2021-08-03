<?php

namespace AppBundle\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Form\FormEvent;
use Symfony\Component\Form\FormEvents;
use AppBundle\Helper\GenericHelper;

class VitalStatType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder->addEventListener(FormEvents::PRE_SET_DATA, function (FormEvent $event) {
            $record = $event->getData();
            $form = $event->getForm();

            if (null !== $record && null !== $record->getId()) {
                $form->add('date', null, ['disabled' => true])->add('person', null, ['disabled' => true]);

            } else {
                $form->add('date')->add('person');
            }

            $allFields = ['distance', 'distance_run', 'floors_run', 'distance_biked', 'minutes_biked', 'steps', 'sleep', 'weight', 'abdominals', 'score', 'bp', 'pulse', 'za', 'swim'];

            $fields = $record->getPerson() && $record->getPerson()->getFields() ? array_intersect($record->getPerson()->getFields(), $allFields) : $allFields;
            $fields[] = 'comments';

            foreach ($fields as $field) {
                $form->add($field, null, ['required' => false]);
            }
        });
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults(array(
            'data_class' => 'AppBundle\Entity\VitalStat'
        ));
    }

    public function getBlockPrefix()
    {
        return 'appbundle_vitalstat';
    }
}
