import Agree from '@/pages/SignUp/Identity/Agree';
import Icons from '@/pages/SignUp/components/Icons';
import Inputs from '@/pages/SignUp/Identity/Inputs';
import Title from '@/pages/SignUp/components/Title';
import identity from '@/assets/icons/etc/identity_verification_finished.svg';
import info from '@/assets/icons/etc/info_input_active.svg';
import department from '@/assets/icons/etc/department_verification_inactive.svg';


function Info() {
  const sequence = ['finished', 'active', 'inactive'];

  return (
   <>
     <Title title="정보입력" />
     <Icons identity={identity} info={info} department={department} sequence={sequence}/>
     <Inputs />
     <Agree />
   </>
  );
}

export default Info;